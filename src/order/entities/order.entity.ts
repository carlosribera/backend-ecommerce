import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { DetailOrder } from './detail_order.entity';
import { User } from 'src/auth/entities/user.entity';

@Entity()
export class Order { 

  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  dateOrder: string;

  @Column('text')
  state: string;

  @Column('float', { default: 0 })
  total: number;

  @Column('text',{nullable: true})
  deliveryAddress?: string;

  @Column('text')
  deliveryDate: string;

  @Column('text', { nullable: true })
  details: string;

  @OneToMany(() => DetailOrder, detail => detail.order)
  detailsOrder: DetailOrder[];

  @ManyToOne(
    () => User,
    (user) => user.product,
    { eager: true }
  )
  user: User
}
