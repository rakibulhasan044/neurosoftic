const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const v = await prisma.productVariant.findMany({
    skip: 0,
    take: 10
  });
  console.log(v.length, v[0]);
}
main().catch(console.error).finally(()=>prisma.$disconnect());
