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
    const products = await prisma.product.findMany({
      include: {
        category: true,
        brand: true,
        variants: {
          include: {
            _count: { select: { orderItems: true } }
          }
        },
        media: true,
        reviews: {
          where: { status: "APPROVED" },
          select: { rating: true }
        },
        _count: {
          select: { reviews: { where: { status: "APPROVED" } } }
        }
      }
    });

    // Add computed stats
    return products.map(product => {
      let totalOrders = 0;
      product.variants.forEach((v: any) => {
        totalOrders += (v._count?.orderItems || 0);
      });
      
      const totalRating = product.reviews.reduce((acc: number, r: any) => acc + r.rating, 0);
      const avgRating = product.reviews.length > 0 ? (totalRating / product.reviews.length).toFixed(1) : "0.0";
      
      return {
        ...product,
        totalOrders,
        avgRating
      };
    });
  },

  getProductBySlug: async (slug: string) => {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        brand: true,
        variants: {
          include: {
            _count: { select: { orderItems: true } }
          }
        },
        media: true,
        reviews: {
          where: { status: "APPROVED" },
          select: { rating: true }
        },
        _count: {
          select: { reviews: { where: { status: "APPROVED" } } }
        }
      }
    });

    if (!product) return null;

    let totalOrders = 0;
    product.variants.forEach((v: any) => {
      totalOrders += (v._count?.orderItems || 0);
    });
    
    const totalRating = product.reviews.reduce((acc: number, r: any) => acc + r.rating, 0);
    const avgRating = product.reviews.length > 0 ? (totalRating / product.reviews.length).toFixed(1) : "0.0";
    
    return {
      ...product,
      totalOrders,
      avgRating
    };
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
