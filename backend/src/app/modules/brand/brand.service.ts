import { prisma } from "../../lib/prisma";

export const BrandService = {
  create: async (payload: any) => {
    if (!payload.slug && payload.name) {
      payload.slug = payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    return await prisma.brand.create({ data: payload });
  },
  getAll: async () => {
    return await prisma.brand.findMany();
  },
  getBySlug: async (slug: string) => {
    const record = await prisma.brand.findUnique({ 
      where: { slug },
      include: { products: true }
    });
    if (!record) throw new Error("Brand not found");
    return record;
  },
  update: async (id: string, payload: any) => {
    return await prisma.brand.update({
      where: { id },
      data: payload
    });
  },
  delete: async (id: string) => {
    return await prisma.brand.delete({ where: { id } });
  }
};
