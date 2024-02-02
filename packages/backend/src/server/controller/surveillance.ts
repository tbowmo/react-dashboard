import { SurveillanceStream } from '@dashboard/types'

export class SurveillanceController {
    async streams(): Promise<SurveillanceStream[]> {
        let i = 0
        let url: string | undefined
        const urls: SurveillanceStream[] = []

        do {
            url = process.env[`SURVEILLANCE_${i}`]
            if (url) {
                urls.push({ url })
            }
            i ++
        } while (url !== undefined && i < 5)

        return urls
    }

}
