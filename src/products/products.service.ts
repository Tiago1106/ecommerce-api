import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { getSortOrder } from 'src/utils/getSortOrder.utils';
import { SortOption } from 'src/enums/sortOption.enum';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        discountPrice: data.discountPrice,
        quantity: data.quantity,
        images: data.images,
        categories: {
          connect: data.categoryIds
            ? data.categoryIds.map((id) => ({ id }))
            : undefined,
        },
      },
      include: {
        categories: {
          where: { isActive: true },
        },
      },
    });
  }

  async findAll(limit?: number) {
    return this.prisma.product.findMany({
      take: limit,
      where: {
        quantity: {
          gt: 0,
        },
      },
      include: {
        categories: {
          where: { isActive: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        categories: {
          where: { isActive: true },
        },
      },
    });
    if (!product) throw new NotFoundException('Produto não encontrado');
    return product;
  }

  async update(id: string, data: UpdateProductDto) {
    await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        discountPrice: data.discountPrice,
        quantity: data.quantity,
        images: data.images,
        categories: data.categoryIds
          ? {
              set: data.categoryIds.map((id) => ({ id })),
            }
          : undefined,
      },
      include: {
        categories: {
          where: { isActive: true },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.product.delete({ where: { id } });
  }

  async getProductsByCategory({
    categoryId,
    sort = SortOption.NAME_ASC,
    page = 1,
    limit = 10,
  }: {
    categoryId: string;
    sort?: SortOption;
    page?: number;
    limit?: number;
  }) {
    const orderBy = getSortOrder(sort);

    const [products, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where: {
          categories: {
            some: {
              id: categoryId,
            },
          },
        },
        orderBy,
        take: limit,
        skip: (page - 1) * limit,
      }),
      this.prisma.product.count({
        where: {
          categories: {
            some: {
              id: categoryId,
            },
          },
        },
      }),
    ]);

    return {
      products,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }
}
