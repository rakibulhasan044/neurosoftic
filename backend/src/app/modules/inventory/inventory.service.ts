import { prisma } from "../../lib/prisma";
import { paginationHelper } from "../../shared/paginationHelper";

export const InventoryService = {
  getInventory: async (filters: any) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(filters);
    const { search } = filters;

    const where: any = {};
    if (search) {
      where.product = { name: { contains: search, mode: 'insensitive' } };
    }

    const [variants, total] = await Promise.all([
      prisma.productVariant.findMany({
        where,
        skip,
        take: limit,
        include: {
          product: { select: { name: true, media: true } }
        },
        orderBy: { [sortBy === 'createdAt' ? 'stock' : sortBy]: sortOrder }
      }),
      prisma.productVariant.count({ where })
    ]);

    return {
      variants,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  adjustStock: async (id: string, newStock: number) => {
    return prisma.productVariant.update({
      where: { id },
      data: { stock: newStock }
    });
  }
};
