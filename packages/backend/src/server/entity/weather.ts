import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity()
export class Weather {
  @PrimaryColumn()
  type!: string

  @Column()
  timestamp!: number

  @Column()
  json!: string
}
