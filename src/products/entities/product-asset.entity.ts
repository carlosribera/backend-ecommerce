import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class ProductAsset {

  @PrimaryGeneratedColumn()
  id: number;
  
  @Column('text')
  url: string;

  @Column('text')
  type: string;

  @ManyToOne(
    ()=> Product,
    (product) => product.images,
    { onDelete: 'CASCADE' }
  )
  product: Product
}
