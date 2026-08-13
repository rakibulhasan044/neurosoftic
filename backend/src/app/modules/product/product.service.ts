import { prisma } from "@/app/lib/prisma";

export const ProductService = {
  createProduct: async (payload: any) => {
    return await prisma.product.create({
      data: payload,
      include: {
        category: true,
        brand: true,
        variants: true,
        media: true,
      }
    });
  },

  getAllProducts: async () => {
    return await prisma.product.findMany({
      include: {
        category: true,
        brand: true,
        variants: true,
        media: true,
      }
    });
  },

  getProductBySlug: async (slug: string) => {
    return await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        brand: true,
        variants: true,
        media: true,
      }
    });
  },

  updateProduct: async (id: string, payload: any) => {
    return await prisma.product.update({
      where: { id },
      data: payload,
      include: {
        category: true,
        brand: true,
        variants: true,
        media: true,
      }
    });
  },

  deleteProduct: async (id: string) => {
    return await prisma.product.delete({ where: { id } });
  }
};
