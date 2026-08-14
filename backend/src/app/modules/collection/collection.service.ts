import { prisma } from "../../lib/prisma";

export const CollectionService = {
  create: async (payload: any) => {
    const { productIds, ...data } = payload;
    if (!data.slug && data.name) {
      data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    return await prisma.collection.create({ 
      data: {
        ...data,
        products: productIds ? { connect: productIds.map((id: string) => ({ id })) } : undefined
      }
    });
  },
  getAll: async () => {
    return await prisma.collection.findMany({
      include: {
        _count: { select: { products: true } },
        products: { select: { id: true } }
      }
    });
  },
  getBySlug: async (slug: string) => {
    const record = await prisma.collection.findUnique({ 
      where: { slug },
      include: { 
        products: {
          include: {
            media: true,
            variants: true,
            category: true,
            _count: { select: { reviews: true } }
          }
        } 
      }
    });
    if (!record) throw new Error("Collection not found");
    return record;
  },
  update: async (id: string, payload: any) => {
    const { productIds, ...data } = payload;
    return await prisma.collection.update({
      where: { id },
      data: {
        ...data,
        products: productIds ? { set: productIds.map((id: string) => ({ id })) } : undefined
      }
    });
  },
  delete: async (id: string) => {
    return await prisma.collection.delete({ where: { id } });
  }
};
