import {
    Entity,
    Column,
    PrimaryColumn,
} from 'typeorm'

@Entity()
export class XmlFile {

    @PrimaryColumn()
    file!: string

    @Column()
    md5sum!: string

    @Column()
    importDate!: Date
}
