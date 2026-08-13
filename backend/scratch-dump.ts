import { prisma } from './src/app/lib/prisma';

async function run() {
  const users = await prisma.user.findMany({ select: { id: true, email: true } });
  console.log("Users:", users);

  const orders = await prisma.order.findMany({
    select: { id: true, userId: true, customerEmail: true, status: true, paymentMode: true }
  });
  console.log("Orders:", orders);
}
run();
