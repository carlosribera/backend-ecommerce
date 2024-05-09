import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { User } from './../auth/entities/user.entity';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './../products/entities';
import { Order } from './entities/order.entity';
import { DetailOrder } from './entities/detail_order.entity';

interface ProductI{
  id: string;
  amount: number;
}
@Injectable()
export class OrderService {

  private readonly logger = new Logger('ProductsService')

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(DetailOrder)
    private readonly detailOrderRepository: Repository<DetailOrder>,

    private readonly dataSource:DataSource
  ) {

  }
  async create(createOrderDto: CreateOrderDto, user: User) {
    //*1. Validar que la longitud de los productos sea mayor a 0
    //*2. Crear la orden
    //*3. Recorrer la lista de productos en un map, y crear las tuplas intermedias y añadir el obj de la nueva orden.
    //*4. Buscar cada producto y añadir ese objeto
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {

      const { products = [], ...payload } = createOrderDto;

      if (products.length === 0) throw new BadRequestException(`The order has no products.`)
      const order = this.orderRepository.create({...payload, user})
      
      await queryRunner.manager.save(order);

      const orderDetails = await Promise.all(
        products.map( async (product:ProductI)=> this.detailOrderRepository.create({
          order,
          product: await this.productRepository.findOneBy({id: product.id}),
          amount: product.amount,
        }))
      )
      
      await queryRunner.manager.save(orderDetails);
      await queryRunner.commitTransaction();
      return order;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleDBException(error);

    } finally {
      await queryRunner.release()
    }

  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  
  private handleDBException(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);
    this.logger.error(error);
    if (error.response ) {
      throw new BadRequestException(error.response.message);
    }
    throw new InternalServerErrorException(`Unexpected error, Check server logs`)
  }
}
