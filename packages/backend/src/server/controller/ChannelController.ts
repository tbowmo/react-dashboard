import { Request } from 'express'
import { getRepository, Raw } from 'typeorm'
import { Channel } from '../entity/channel'
import { Programme } from '../entity/programme'

export class ChannelController {
  private channelRepository = getRepository(Channel)
  private programmeRepository = getRepository(Programme)

  async channelList(request: Request) {
    const type = request.params.type === 'tv' ? 'video%' : 'audio%'

    return await this.channelRepository
      .createQueryBuilder()
      .leftJoinAndSelect('Channel.programmes', 'programme')
      .where('type like :type', { type })
      .andWhere('link != ""')
      .andWhere('datetime(start) <= datetime(:date)', {
        date: new Date().toISOString(),
      })
      .andWhere('datetime(end) >= datetime(:date)', {
        date: new Date().toISOString(),
      })
      .orderBy('name', 'ASC')
      .getMany()
  }

  async currentProgramme(request: Request) {
    const { xmlid } = request.params
    const prg = this.programmeRepository.find({
      where: {
        channel: {
          xmlid,
        },
        start: Raw(
          (alias) =>
            `datetime(${alias}) <= datetime("${new Date().toISOString()}")`,
        ),
        end: Raw(
          (alias) =>
            `datetime(${alias}) >= datetime("${new Date().toISOString()}")`,
        ),
      },
    })
    return prg
  }
}
