import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

import { ConfigModule } from '@nestjs/config';
import { Product, ProductAsset } from './entities';
import { ProductModel } from './entities/product-model.entity';
import { Order } from 'src/order/entities/order.entity';
import { DetailOrder } from 'src/order/entities/detail_order.entity';
import { CategoryModule } from 'src/category/category.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([Product, ProductAsset, ProductModel, Order,DetailOrder]),
    CategoryModule,
    AuthModule,
    // ConfigModule,
  ],
  exports: [
    ProductsService,
    TypeOrmModule,
  ],
})
export class ProductsModule {}
