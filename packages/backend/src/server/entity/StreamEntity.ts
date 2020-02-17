import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
} from 'typeorm'

@Entity()
export class StreamEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    json!: string;

    @Column()
    type!: 'tv' | 'audio'

}
