import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([ Category ])
  ],
  exports: [
    TypeOrmModule,
  ]
})
export class CategoryModule {}
