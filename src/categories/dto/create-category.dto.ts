import { IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Nome da categoria' })
  @IsString()
  name!: string; // Nome da categoria

  @ApiProperty({ description: 'Imagem da categoria' })
  @IsString()
  image!: string;
}
