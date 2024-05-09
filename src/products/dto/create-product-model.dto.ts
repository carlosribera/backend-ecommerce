import {  IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateProductModelDto {

  @IsString()
  url: string;

  @IsString()
  format: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price: number;

}
