import { prisma } from "@/app/lib/prisma";

export const InventoryService = {
  getInventory: async (filters: any) => {
    const { page = 1, limit = 50, search } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.product = { name: { contains: search, mode: 'insensitive' } };
    }

    const [variants, total] = await Promise.all([
      prisma.productVariant.findMany({
        where,
        skip: Number(skip),
        take: Number(limit),
        include: {
          product: { select: { name: true, image: true } }
        },
        orderBy: { stock: 'asc' }
      }),
      prisma.productVariant.count({ where })
    ]);

    return {
      variants,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
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
