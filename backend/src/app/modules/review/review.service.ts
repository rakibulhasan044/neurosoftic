import { prisma } from "../../lib/prisma";

export const ReviewService = {
  createReview: async (userId: string, payload: any) => {
    const { productId, rating, comment } = payload;

    // Check if user exists to get email
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    // 1. Check if user has ordered the item at all (ignoring status)
    const hasOrdered = await prisma.orderItem.findFirst({
      where: {
        order: {
          OR: [
            { userId: userId },
            { customerEmail: user?.email || "" }
          ]
        },
        variant: { productId: productId }
      },
      include: {
        order: true
      }
    });

    if (!hasOrdered) {
      throw new Error("You can only review products you have purchased.");
    }

    // 2. Check if the order is DELIVERED
    if (hasOrdered.order.status !== 'DELIVERED') {
      throw new Error("Only delivered items can be reviewed.");
    }

    // Check if user has already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: { userId, productId }
    });

    if (existingReview) {
      throw new Error("You have already reviewed this product.");
    }

    // Create the review (defaults to PENDING or APPROVED based on logic, we use APPROVED for simplicity)
    const review = await prisma.review.create({
      data: {
        userId,
        productId,
        rating,
        comment,
        status: "APPROVED", // Auto-approve for MVP
        isVerified: true
      }
    });

    return review;
  },

  getAllReviews: async (limit: number = 4) => {
    return await prisma.review.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true } }
      }
    });
  },

  getProductReviews: async (productId: string, filters: any) => {
    const { page = 1, limit = 5 } = filters;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { productId, status: "APPROVED" },
        skip: Number(skip),
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, profile: { select: { id: true } } } } // getting name to display
        }
      }),
      prisma.review.count({
        where: { productId, status: "APPROVED" }
      })
    ]);

    return {
      reviews,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
      }
    };
  }
};
