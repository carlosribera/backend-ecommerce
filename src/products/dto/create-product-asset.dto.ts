import { IsIn, IsString } from "class-validator";

export class CreateProductAssetDto {

  @IsString()
  url: string;

  @IsString()
  @IsIn(['image','video'])
  type: string;

}
