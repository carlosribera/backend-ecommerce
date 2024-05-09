import { Inject, Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';
import { User } from 'src/auth/entities/user.entity';
import { CategoryService } from './../category/category.service';


@Injectable()
export class SeedService {

  constructor(
    @Inject(CategoryService)
    private readonly categoriesService: CategoryService,
    @Inject(ProductsService)
    private readonly productsService: ProductsService
  ) { }


  async runSeed(user: User) {
    await this.insertCategories();
    await this.insertProducts(user);
    return 'SEED executed succesfully';
  }

  private async insertCategories() {
    await this.categoriesService.deleteAllCategories();
    
    const categories = initialData.categories;
    const insertPromise = [];

    categories.forEach(categories => {
      insertPromise.push(this.categoriesService.create(categories))
    });
    await Promise.all(insertPromise);
    return true
  }

  private async insertProducts(user: User) {
    await this.productsService.deleteAllProducts();
    const products = initialData.products;
    const insertPromise = [];

    products.forEach(product => {
      insertPromise.push(this.productsService.create(product, user))
    });
    await Promise.all(insertPromise);
    return true
  }
}
