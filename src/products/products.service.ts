import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';

import { CreateProductDto, UpdateProductDto } from './dto';
import { validate as isUUID } from 'uuid';
import { Product, ProductAsset, ProductModel } from './entities';
import { CreateProductModelDto } from './dto/create-product-model.dto';
import { CreateProductAssetDto } from './dto/create-product-asset.dto';
import { User } from 'src/auth/entities/user.entity';
import { Category } from 'src/category/entities/category.entity';
import { DetailOrder } from './../order/entities/detail_order.entity';

@Injectable()
export class ProductsService {


  private readonly logger = new Logger('ProductsService')

  constructor(

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductAsset)
    private readonly productAssetRepository: Repository<ProductAsset>,

    @InjectRepository(ProductModel)
    private readonly productModelRepository: Repository<ProductModel>,

    @InjectRepository(DetailOrder)
    private readonly detailOrderRepository: Repository<DetailOrder>,


    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    private readonly dataSource: DataSource,

  ) { }

  async create(createProductDto: CreateProductDto, user: User) {
    try {
      const { images = [], models = [], categoryId, ...productDetails } = createProductDto;

      // const user = await this.UserRepository.findOneBy({ id: userId });
      // if (!user) throw new BadRequestException(`El usuario no existe`)

      const category = await this.categoryRepository.findOneBy({ id: categoryId })
      if (!category) throw new BadRequestException(`la categoria no existe`)


      const product = this.productRepository.create({
        ...productDetails,
        user,
        category,
        images: images.map((image: CreateProductAssetDto) => this.productAssetRepository.create(image)),
        models: models.map((model: CreateProductModelDto) => this.productModelRepository.create(model))
      });

      await this.productRepository.save(product);

      return { ...product, images };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async addAsset(id: string, data: CreateProductAssetDto) {
    const product = await this.findOne(id);
    if (!product)
      throw new NotFoundException(`product not found  with id: ${id}`)

    const newAsset = this.productAssetRepository.create({
      url: data.url,
      type: data.type,
      product: product,
    })
    return this.productAssetRepository.save(newAsset)
  }

  async addModel(id: string, data: CreateProductModelDto) {
    const product = await this.findOne(id);
    if (!product)
      throw new NotFoundException(`product not found  with id: ${id}`)

    const newModel = this.productModelRepository.create({
      url: data.url,
      format: data.format,
      price: data.price,
      product: product,
    })
    return this.productModelRepository.save(newModel)
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true,
      }
    })
    return products.map(product => ({
      ...product,
      images: product.images.map(img => img.url)
    }))
  }

  async findOne(term: string) {
    let product: Product;

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      // product = await this.productRepository.findOneBy({ slug: term });
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder
        .where('UPPER(name) =:name or slug =:slug', {
          name: term.toUpperCase(),
          slug: term.toLocaleLowerCase()
        })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();
    }

    if (!product) {
      throw new NotFoundException(`Product with term ${term} not found`);
    }
    return product;
  }

  async findOnePlain(term: string) {
    const { images = [], ...rest } = await this.findOne(term);
    return {
      ...rest,
      images: images.map(image => image.url)
    }
  }


  async update(id: string, updateProductDto: UpdateProductDto) {

    const { images, models, ...toUpdate } = updateProductDto;
    const product = await this.productRepository.preload({ id, ...toUpdate });

    if (!product) throw new NotFoundException(`Product with id: ${id} not found.`);

    // Create query runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();


    try {

      if (images) {
        await queryRunner.manager.delete(ProductAsset, { product: { id } });
        product.images = images.map(
          image => this.productAssetRepository.create(image)
        )
      }
      if (models) {
        await queryRunner.manager.delete(ProductModel, { product: { id } });
        product.models = models.map(
          model => this.productModelRepository.create(model)
        )
      }

      await queryRunner.manager.save(product);
      // await this.productRepository.save(product);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return this.findOnePlain(id);

    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBException(error);
    }

  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
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

  async deleteAllProducts() {
    const queryDetailOrder = this.detailOrderRepository.createQueryBuilder('detail_order');
    const queryProduct = this.productRepository.createQueryBuilder('product');

    try {
      await queryDetailOrder.delete().where({}).execute();
      await queryProduct.delete().where({}).execute();

      await this.resetSequence('detail_order_id_seq');
      await this.resetSequence('category_id_seq');
      
    } catch (error) {
      this.handleDBException(error);
    }
  }

  
  private async resetSequence(sequenceName: string) {
    const resetQuery = `ALTER SEQUENCE ${sequenceName} RESTART WITH 1;`;

    try {
      await this.productRepository.query(resetQuery);
      console.log(`Secuencia ${sequenceName} reiniciada correctamente.`);
    } catch (error) {
      console.error(`Error al reiniciar la secuencia ${sequenceName}:`, error);
      throw error; // Propagar el error para que sea manejado en un nivel superior si es necesario
    }
  }
}
