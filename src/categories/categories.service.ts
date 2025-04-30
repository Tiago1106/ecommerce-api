import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCategoryDto) {
    return this.prisma.category.create({ data });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Categoria com ID ${id} não encontrada`);
    }
    return category;
  }

  async findAllActive() {
    return this.prisma.category.findMany({
      where: { isActive: true },
    });
  }

  async findAll() {
    return this.prisma.category.findMany();
  }

  // "Remove" a categoria desativando-a
  async remove(id: string) {
    await this.findOne(id); // garante que existe

    return this.prisma.category.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
