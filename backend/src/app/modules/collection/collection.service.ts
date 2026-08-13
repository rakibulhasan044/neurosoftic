import { prisma } from "@/app/lib/prisma";

export const CollectionService = {
  create: async (payload: any) => {
    if (!payload.slug && payload.name) {
      payload.slug = payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    return await prisma.collection.create({ data: payload });
  },
  getAll: async () => {
    return await prisma.collection.findMany();
  },
  getBySlug: async (slug: string) => {
    const record = await prisma.collection.findUnique({ where: { slug } });
    if (!record) throw new Error("Collection not found");
    return record;
  },
  update: async (id: string, payload: any) => {
    return await prisma.collection.update({
      where: { id },
      data: payload
    });
  },
  delete: async (id: string) => {
    return await prisma.collection.delete({ where: { id } });
  }
};
