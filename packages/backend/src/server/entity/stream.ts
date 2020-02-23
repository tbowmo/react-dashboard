import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
} from 'typeorm'

@Entity()
export class Stream {

    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @Column()
    json!: string

    @Column()
    type!: 'tv' | 'audio'

    @Column()
    xmlid!: string
}
