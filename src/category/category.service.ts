import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger('ProductsService')

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) { }

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = this.categoryRepository.create(createCategoryDto);

      await this.categoryRepository.save(category);
      return category;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll() {
    return await this.categoryRepository.find({});
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category)
      throw new NotFoundException(`Category with id: ${id} Not found`)
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {

    const category = await this.categoryRepository.preload({
      id: id,
      ...updateCategoryDto
    })

    if (!category) throw new NotFoundException(`Category with id: ${id} not found`);

    try {
      await this.categoryRepository.save(category);
      return category;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
  }

  private handleDBException(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException(`Unexpected error, Check server logs`)
  }

  
  async deleteAllCategories() {
    const queryCategory = this.categoryRepository.createQueryBuilder('category');

    try {
      await queryCategory.delete().where({}).execute();

      await this.resetSequence('category_id_seq');
      
    } catch (error) {
      this.handleDBException(error);
    }
  }

  
  private async resetSequence(sequenceName: string) {
    const resetQuery = `ALTER SEQUENCE ${sequenceName} RESTART WITH 1;`;

    try {
      await this.categoryRepository.query(resetQuery);
      console.log(`Secuencia ${sequenceName} reiniciada correctamente.`);
    } catch (error) {
      console.error(`Error al reiniciar la secuencia ${sequenceName}:`, error);
      throw error; // Propagar el error para que sea manejado en un nivel superior si es necesario
    }
  }
}
