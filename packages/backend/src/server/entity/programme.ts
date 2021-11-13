import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Channel } from './channel'

@Entity()
export class Programme {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  title!: string

  @Column()
  start!: Date

  @Column()
  end!: Date

  @Column()
  description!: string

  @Column()
  category!: string

  @ManyToOne((type) => Channel, (channel) => channel.programmes)
  channel!: Channel
}
