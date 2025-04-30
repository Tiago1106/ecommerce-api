import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsUrl,
  IsDate,
  IsUUID,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  price!: number;

  @IsOptional()
  @IsNumber()
  discountPrice?: number;

  @IsArray()
  @IsUrl({}, { each: true })
  images!: string[];

  @IsArray()
  @IsUUID('4', { each: true })
  categoryIds!: string[];

  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}
