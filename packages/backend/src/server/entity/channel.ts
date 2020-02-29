import {
    Entity,
    Column,
    PrimaryColumn,
    OneToMany,
} from 'typeorm'
import { Programme } from './programme'

@Entity()
export class Channel {

    @PrimaryColumn()
    xmlid!: string

    @Column()
    name!: string

    @Column()
    icon!: string

    @Column()
    link!: string

    @Column()
    type!: string

    @OneToMany((_type) => Programme, (programme) => programme.channel)
    programmes!: Programme[]
}
