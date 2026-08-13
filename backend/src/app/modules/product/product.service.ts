import { prisma } from "@/app/lib/prisma";


export const ProductService = {
  createProduct: async (payload: any) => {
    return await prisma.product.create({
      data: payload,
      include: {
        category: true,
        variants: true,
      }
    });
  },

  getAllProducts: async () => {
    return await prisma.product.findMany({
      include: {
        category: true,
        variants: true,
      }
    });
  },

  getProductBySlug: async (slug: string) => {
    return await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        variants: true,
      }
    });
  }
};
