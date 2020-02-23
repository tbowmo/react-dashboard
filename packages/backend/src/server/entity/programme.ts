import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
} from 'typeorm'

@Entity()
export class Programme {

    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @Column()
    json!: string

    @Column()
    xmlid!: string
}
