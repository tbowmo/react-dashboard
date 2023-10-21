import { useMemo } from 'react'
import { isBefore, parseISO } from 'date-fns'
import drp1 from './logo/DRP1_logo_primaer_RGB.svg'
import drp2 from './logo/DRP2_logo_primaer_RGB.svg'
import drp3 from './logo/DRP3_logo_primaer_RGB.svg'
import drp4 from './logo/DRP4_logo_primaer_RGB.svg'
import drp5 from './logo/DRP5_logo_primaer_RGB.svg'
import drp6 from './logo/DRP6_logo_primaer_RGB.svg'
import drp8 from './logo/DRP8_logo_primaer_RGB.svg'
import { DRMedia } from './dr-media-type'
import { api } from '../use-api'
import { useQuery } from '@tanstack/react-query'

export type Media = {
  id: string
  startTime: Date
  endTime: Date
  title: string
  link: string
  type: string
  avatar: string
  channelName: string
  channelIcon: string
  duration: number
}

function dateConverter(d: string): Date {
    return parseISO(d)
}

export function isNotUndefined<T>(input: T): input is Exclude<T, undefined> {
    return input !== undefined
}

const validChannels = ['p1', 'p2', 'p3', 'p4nord', 'p5nord', 'p6beat', 'p8jazz']

function imgUrl(url: string | undefined): string {
    const splitAsset = url?.split(':') || []
    const assetNumber =
    splitAsset.length > 1 ? splitAsset[splitAsset?.length - 1] : ''

    const imgProps: string[] = Object.entries({
        protocol: 'https', 
        server: 'api.dr.dk', 
        file: `/radio/v2/images/raw/urn:dr:radio:image:${assetNumber}`, 
        scaleAfter: 'crop', 
        quality: '70', 
        w: '600', 
        h: '600',
    }).map(([key, value]) => `${key}=${value}`)

    return `https://asset.dr.dk/imagescaler/?${imgProps.join('&')}`
}

function logo(channelName: string) {
    switch (channelName.toLocaleLowerCase()) {
    case 'p1':
        return drp1
    case 'p2':
        return drp2
    case 'p3':
        return drp3
    case 'p4nord':
        return drp4
    case 'p5nord':
        return drp5
    case 'p6beat':
        return drp6
    case 'p8jazz':
        return drp8
    default:
        return ''
    }
}

export function useDrMedia(): Media[] | undefined {
    const { data } = useQuery({
        queryKey: ['media', 'dr'],
        queryFn: () => api<DRMedia[]>('https://api.dr.dk/radio/v2/schedules/all/now-next'),
        refetchInterval: 15*60*1000,
        select: (channels): Media[] => {
            return channels
                ?.filter((channel) => (
                    channel.now !== undefined 
                && validChannels.includes(channel.now.channel.slug)
                ))
                .flatMap((channel) => {
                    return [channel?.now, channel?.next]?.map((prg) => {

                        const startTime = dateConverter(prg.startTime)
                        const endTime = dateConverter(prg.endTime)

                        return {
                            id: channel.now.channel.slug,
                            channelName: channel.now.channel.title,
                            channelIcon: logo(channel.now.channel.slug),
                            startTime,
                            endTime,
                            title: prg.title || channel.now.channel.title,
                            link: channel.now.audioAssets.find((item) => item.bitrate === 192)?.url ?? '',
                            avatar: imgUrl(prg.imageAssets[0].id),
                            type: 'audio',
                            duration: (endTime.getTime() - startTime.getTime()) / 1000,
                        }
                    })
                })
                .filter(isNotUndefined)   
        },
    })
    const channels = useMemo(
        // Only get currently playing programmes for dashboard
        () => data?.filter((item) => isBefore(item.startTime, Date.now()) && isBefore(Date.now(), item.endTime)), 
        [data]
    )
    return channels
}
