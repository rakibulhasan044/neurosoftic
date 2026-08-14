import { prisma } from "../../lib/prisma";

export const WishlistService = {
  getWishlist: async (userId: string) => {
    // Upsert wishlist to ensure it exists for the user
    let wishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            media: true,
            variants: true
          }
        }
      }
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId },
        include: {
          items: {
            include: {
              media: true,
              variants: true
            }
          }
        }
      });
    }

    return wishlist;
  },

  toggleWishlist: async (userId: string, productId: string) => {
    let wishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: { items: { select: { id: true } } }
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId },
        include: { items: { select: { id: true } } }
      });
    }

    const isProductInWishlist = wishlist.items.some(item => item.id === productId);

    if (isProductInWishlist) {
      // Remove from wishlist
      await prisma.wishlist.update({
        where: { id: wishlist.id },
        data: {
          items: {
            disconnect: { id: productId }
          }
        }
      });
      return { message: "Product removed from wishlist", added: false };
    } else {
      // Add to wishlist
      await prisma.wishlist.update({
        where: { id: wishlist.id },
        data: {
          items: {
            connect: { id: productId }
          }
        }
      });
      return { message: "Product added to wishlist", added: true };
    }
  }
};
