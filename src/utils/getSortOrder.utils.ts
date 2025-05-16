import { Prisma } from '@prisma/client';
import { SortOption } from '../enums/sortOption.enum';

export function getSortOrder(
  sort: SortOption,
): Prisma.ProductOrderByWithRelationInput {
  const sortMap: Record<SortOption, Prisma.ProductOrderByWithRelationInput> = {
    [SortOption.PRICE_ASC]: { price: 'asc' },
    [SortOption.PRICE_DESC]: { price: 'desc' },
    [SortOption.NAME_ASC]: { name: 'asc' },
    [SortOption.NAME_DESC]: { name: 'desc' },
  };

  // fallback caso sort não esteja no enum (opcional)
  return sortMap[sort] ?? { name: 'asc' };
}
