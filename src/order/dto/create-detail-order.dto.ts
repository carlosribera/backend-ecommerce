import { IsInt, IsNumber, IsPositive } from "class-validator";

export class CreateDetailOrderDto {

  @IsInt()
  @IsPositive()
  amount: number;

}