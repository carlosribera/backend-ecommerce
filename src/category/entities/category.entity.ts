import { Product } from "src/products/entities";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Category {
  
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column('text', {unique: true})
  name: string;

  @Column('text', {nullable: true})
  description: string;

  @OneToMany(
    () => Product, 
    (product) => product.category 
  )
  product: Product[]
}
