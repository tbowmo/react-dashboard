type Programme = {
    id: number,
    title: string,
    start: Date,
    end: Date,
    description: string,
    category: string,
}

export type StreamDto = {
    name: string,
    xmlid: string,
    link: string,
    type: string,
    icon: string,
    programmes: Programme[]
}

