import { IsArray, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {

  @IsString()
  @MinLength(1)
  name: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags?: string[]

  @IsArray()
  @IsOptional()
  images?: object[]

  @IsArray()
  @IsOptional()
  models?: object[]


  @IsNumber()
  @IsPositive()
  categoryId: number

}