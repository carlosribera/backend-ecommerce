import { Module } from '@nestjs/common';

import { AuthModule } from 'src/auth/auth.module';
import { ProductsModule } from 'src/products/products.module';

import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { CategoryModule } from 'src/category/category.module';
import { CategoryService } from 'src/category/category.service';

@Module({
  controllers: [SeedController],
  providers: [CategoryService, SeedService],
  imports: [
    CategoryModule,
    ProductsModule, 
    AuthModule,
  ],
})
export class SeedModule {}
