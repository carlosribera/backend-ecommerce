import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from 'src/products/entities';
import { Order } from './order.entity';

@Entity()
export class DetailOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { default: 0 })
  amount: number;

  @ManyToOne(() => Order, order => order.detailsOrder)
  order: Order;

  @ManyToOne(() => Product, product => product.detallesPedido)
  product: Product;
}