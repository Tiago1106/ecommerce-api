import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { getSortOrder } from 'src/utils/getSortOrder.utils';
import { SortOption } from 'src/enums/sortOption.enum';
import * as XLSX from 'xlsx';

interface ProductExcel {
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  quantity: number;
  images: string[];
  categories: string[];
}

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

  async processExcel(
    filePath: string,
  ): Promise<{ success: boolean; importedCount: number; errors?: string[] }> {
    try {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Ler todas as linhas convertendo para JSON
      const rawData: any[] = XLSX.utils.sheet_to_json(worksheet, {
        defval: '',
      });

      // Mapear para o formato esperado, separando vírgulas e convertendo tipos
      const products: ProductExcel[] = rawData.map(
        (row: Record<string, any>) => ({
          name: String(row.name),
          description: row.description ? String(row.description) : undefined,
          price: parseFloat(String(row.price)),
          discountPrice: row.discountPrice
            ? parseFloat(String(row.discountPrice))
            : undefined,
          quantity: parseInt(String(row.quantity)),
          images:
            typeof row.images === 'string'
              ? row.images.split(',').map((i: string) => i.trim())
              : [],
          categories:
            typeof row.categories === 'string'
              ? row.categories.split(',').map((c: string) => c.trim())
              : [],
        }),
      );

      let importedCount = 0;
      const errors: string[] = [];

      for (const product of products) {
        // Validações básicas
        if (!product.name || isNaN(product.price) || isNaN(product.quantity)) {
          errors.push(
            `Produto com nome "${product.name}" tem dados inválidos.`,
          );
          continue;
        }

        // Buscar categorias no banco
        const foundCategories = await this.prisma.category.findMany({
          where: { id: { in: product.categories } },
        });

        if (foundCategories.length !== product.categories.length) {
          errors.push(
            `Produto "${product.name}" possui categorias não encontradas no banco.`,
          );
          continue;
        }

        // Criar produto com categorias
        await this.prisma.product.create({
          data: {
            name: product.name,
            description: product.description,
            price: product.price,
            discountPrice: product.discountPrice,
            quantity: product.quantity,
            images: product.images,
            categories: {
              connect: product.categories.map((id) => ({ id })),
            },
          },
        });

        importedCount++;
      }

      return {
        success: true,
        importedCount,
        errors: errors.length ? errors : undefined,
      };
    } catch (err) {
      return { success: false, importedCount: 0, errors: [String(err)] };
    }
  }
}
