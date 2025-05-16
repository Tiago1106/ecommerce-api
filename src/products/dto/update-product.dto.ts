import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsUrl,
  IsUUID,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiProperty({ description: 'Nome do produto' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Descrição do produto' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Preço do produto' })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({ description: 'Preço do produto com desconto' })
  @IsOptional()
  @IsNumber()
  discountPrice?: number;

  @ApiProperty({ description: 'Quantidade do produto' })
  @IsOptional()
  @IsNumber()
  quantity?: number;

  @ApiProperty({ description: 'Imagens do produto' })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  images?: string[];

  @ApiProperty({ description: 'IDs das categorias do produto' })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  categoryIds?: string[];
}
