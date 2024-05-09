import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductAsset } from "./product-asset.entity";
import { ProductModel } from "./product-model.entity";
import { DetailOrder } from "src/order/entities/detail_order.entity";
import { Category } from "src/category/entities/category.entity";
import { User } from "src/auth/entities/user.entity";

@Entity()
export class Product {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('float', { default: 0 })
  price: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column('int', { default: 0 })
  stock: number;

  @Column('text', { array: true, default: [] })
  tags: string[]


  @OneToMany(
    () => DetailOrder,
    productAsset => productAsset.product,
    { cascade: true, eager: true }
  )
  detallesPedido?: DetailOrder[];

  @OneToMany(
    () => ProductAsset,
    productAsset => productAsset.product,
    { cascade: true, eager: true }
  )
  images?: ProductAsset[];

  @OneToMany(
    () => ProductModel,
    productModel => productModel.product,
    { cascade: true, eager: true }
  )
  models?: ProductModel[];

  @ManyToOne(
    () => Category,
    (category) => category.product,
  )
  category: Category;
  
  @ManyToOne(
    () => User,
    (user) => user.product,
    { eager: true }
  )
  user: User
}