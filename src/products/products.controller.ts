import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateProductAssetDto } from './dto/create-product-asset.dto';
import { CreateProductModelDto } from './dto/create-product-model.dto';
import { User } from 'src/auth/entities/user.entity';
import { Auth, GetUser } from './../auth/decorators';
import { ValidRoles } from 'src/auth/interface';


@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Auth(ValidRoles.admin)
  @Post()
  create(@Body() createProductDto: CreateProductDto, @GetUser() user: User) {
    return this.productsService.create(createProductDto, user);
  }

  @Post(':id')
  addAsset(@Param('id', ParseUUIDPipe) id: string, @Body() createProductAssetDto:CreateProductAssetDto) {
    return this.productsService.addAsset(id, createProductAssetDto)
  }
  
  @Post('/model/:id')
  addModel(@Param('id', ParseUUIDPipe) id: string, @Body() createProductModelDto:CreateProductModelDto) {
    return this.productsService.addModel(id, createProductModelDto)
  }

  @Get()
  getAll(@Query() paginationDto:PaginationDto ) {
    console.log(paginationDto);
    return this.productsService.findAll(paginationDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.productsService.findOnePlain(term);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }


  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }

}
