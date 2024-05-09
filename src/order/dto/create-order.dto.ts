import { IsArray, IsInt, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateOrderDto {

  @IsString()
  dateOrder: string

  @IsString()
  state: string;

  @IsNumber()
  @IsPositive()
  total: number

  @IsString()
  @IsOptional()
  deliveryAddress?: string;
  
  @IsString()
  @IsOptional()
  deliveryDate?: string;

  @IsString()
  @IsOptional()
  details?: string;

  @IsArray()
  products: object[]  
}
