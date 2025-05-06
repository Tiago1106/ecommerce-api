import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsUrl,
  IsDate,
  IsUUID,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: 'Nome do produto' })
  @IsString()
  name!: string;

  @ApiProperty({ description: 'Descrição do produto' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Preço do produto' })
  @IsNumber()
  price!: number;

  @ApiProperty({ description: 'Preço do produto com desconto' })
  @IsOptional()
  @IsNumber()
  discountPrice?: number;

  @ApiProperty({ description: 'Imagens do produto' })
  @IsArray()
  @IsUrl({}, { each: true })
  images!: string[];

  @ApiProperty({ description: 'IDs das categorias do produto' })
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
