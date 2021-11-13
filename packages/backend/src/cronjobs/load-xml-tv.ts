/* eslint-disable no-console */
import { Channel } from '../server/entity/channel'
import { getRepository, Raw, Brackets } from 'typeorm'
import * as path from 'path'
import * as md5File from 'md5-file'
import { createReadStream, readFileSync } from 'fs'
import { Programme } from '../server/entity/programme'
import * as xmltv from 'xmltv'
import { format } from 'date-fns'
import * as fg from 'fast-glob'
import { XmlFile } from '../server/entity/xmlfile'
import { xml2json } from 'xml-js'

export const dateFmt = (date: Date) => format(date, 'yyyy-MM-dd HH:mm:SS.000')

async function processProgrammes(filePath: string) {
  console.log('parsing xml', filePath)
  const parser = new xmltv.Parser()
  const xmlFile = createReadStream(filePath)
  await xmlFile.pipe(parser)
  const toDay = new Date()
  parser.on('programme', async (programme) => {
    if (programme.end > toDay) {
      const prg = await getRepository(Programme)
        .createQueryBuilder('programme')
        .where('programme.channel = :xml', { xml: programme.channel })
        .andWhere(
          new Brackets((qb) => {
            qb.where(
              'datetime(start) >= datetime(:start) and datetime(start) <= datetime(:end)',
              {
                start: programme.start.toISOString(),
                end: programme.end.toISOString(),
              },
            ).orWhere(
              'datetime(:start) >= datetime(start) and datetime(:start) <= datetime(end)',
              {
                start: programme.start.toISOString(),
              },
            )
          }),
        )
        .getMany()

      if (prg.length > 0) {
        const idToDelete = prg.map((programme) => programme.id)
        await getRepository(Programme).delete(idToDelete)
      }
      console.log('updating')
      const newPrg = getRepository(Programme).create({
        start: format(programme.start, 'yyyy-MM-dd HH:mm:SS.000'),
        end: format(programme.end, 'yyyy-MM-dd HH:mm:SS.000'),
        title: programme.title[0] || '',
        description: programme.desc[0] || '',
        category: programme.category.join(','),
        channel: {
          xmlid: programme.channel,
        },
      })
      await getRepository(Programme).save(newPrg)
    }
  })
  console.log('end parsing xml', filePath)
}

async function deleteOld() {
  console.log('Deleting old programmes')
  await getRepository(Programme).delete({
    end: Raw(
      (alias) => `datetime(${alias}) < datetime("${new Date().toISOString()}")`,
    ),
  })
}

type XmlChannel = {
  _attributes: {
    id: string
  }
  'display-name': {
    _attributes: {
      lang: string
    }
    _text: string
  }
}

async function updateChannels(filePath: string) {
  const xmlFile = readFileSync(filePath).toString()
  const json = JSON.parse(xml2json(xmlFile, { compact: true }))
  await json?.tv?.channel?.forEach(async (channel: XmlChannel) => {
    const dbEntry = await getRepository(Channel)
      .createQueryBuilder()
      .where('xmlid = :xmlid', { xmlid: channel?._attributes?.id })
      .getCount()
    if (dbEntry === 0) {
      const newChannel = getRepository(Channel).create({
        xmlid: channel?._attributes?.id,
        name: channel['display-name']._text,
        icon: 'default.png',
        link: '',
        type: 'audio/mp3',
      })
      await getRepository(Channel).save(newChannel, { transaction: false })
    }
  })
}

export async function loadXmlTv(xmlDir: string) {
  console.log('starting cron')
  await deleteOld()
  const files = await fg(path.resolve(xmlDir, '*.xml'))
  for (let index = 0; index < files.length; index++) {
    const file = files[index].toString()
    let dbEntry = await getRepository(XmlFile)
      .createQueryBuilder()
      .where('file = :file', { file: file })
      .getOne()
    if (!dbEntry) {
      dbEntry = getRepository(XmlFile).create({
        file: file,
        md5sum: '',
        importDate: '',
      })
    }
    const fileMd5 = await md5File(file)
    if (dbEntry.md5sum !== fileMd5) {
      dbEntry.md5sum = fileMd5
      ;(dbEntry.importDate = new Date()), await updateChannels(file.toString())
      await getRepository(XmlFile).save(dbEntry)
      await processProgrammes(file.toString())
    }
  }
}
