import { prisma } from './src/app/lib/prisma';
import bcrypt from 'bcrypt';

async function run() {
  const email = 'rakib@gmail.com';
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword }
  });
  console.log("Password reset successfully for", email);
}
run();
