import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { AuthModule } from './../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './../products/entities';
import { Order } from './entities/order.entity';
import { DetailOrder } from './entities/detail_order.entity';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [ 
    TypeOrmModule.forFeature([Product,Order,DetailOrder]),
    AuthModule]
})
export class OrderModule {}
