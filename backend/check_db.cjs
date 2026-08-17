const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.count();
  const products = await prisma.product.count();
  const orders = await prisma.order.count();
  const variants = await prisma.productVariant.count();
  console.log({ users, products, orders, variants });
}
main().catch(console.error).finally(() => prisma.$disconnect());
