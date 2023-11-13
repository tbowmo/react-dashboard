import { SurveilanceStream } from '@dashboard/types'

export class SurveilanceController {
    async streams(): Promise<SurveilanceStream[]> {
        let i = 0
        let url: string | undefined
        const urls: SurveilanceStream[] = []

        do {
            url = process.env[`SURVEILANCE_${i}`]
            if (url) {
                urls.push({ url })
            }
            i ++
        } while (url !== undefined && i < 5)

        return urls
    }

}
