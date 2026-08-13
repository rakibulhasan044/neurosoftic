import { prisma } from "@/app/lib/prisma";

export const CategoryService = {
  create: async (payload: any) => {
    if (!payload.slug && payload.name) {
      payload.slug = payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    return await prisma.category.create({ data: payload });
  },
  getAll: async () => {
    return await prisma.category.findMany({
      include: { children: true }
    });
  },
  getBySlug: async (slug: string) => {
    const record = await prisma.category.findUnique({ 
      where: { slug },
      include: { children: true, products: true }
    });
    if (!record) throw new Error("Category not found");
    return record;
  },
  update: async (id: string, payload: any) => {
    return await prisma.category.update({
      where: { id },
      data: payload
    });
  },
  delete: async (id: string) => {
    return await prisma.category.delete({ where: { id } });
  }
};
