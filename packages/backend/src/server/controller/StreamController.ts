import {
    NextFunction,
    Request,
    Response,
} from 'express'
import { getRepository } from 'typeorm'
import { Stream } from '../entity/stream'

export class StreamController {
    private streamRepository = getRepository(Stream)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async streamList(request: Request, response: Response, next: NextFunction) {
        return await this.streamRepository.createQueryBuilder()
            .where('type = :type', { type: request.params.type })
            .getMany()
    }
}
