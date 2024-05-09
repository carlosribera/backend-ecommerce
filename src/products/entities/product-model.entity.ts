import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class ProductModel {

  @PrimaryGeneratedColumn()
  id: number;
  
  @Column('text')
  url: string;

  @Column('text')
  format: string;

  @Column('float', { default: 0 })
  price: number;

  @ManyToOne(
    ()=> Product,
    (product) => product.images,
    { onDelete: 'CASCADE' }
  )
  product: Product
}
