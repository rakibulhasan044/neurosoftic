import { prisma } from './src/app/lib/prisma.js'; prisma.user.findFirst().then(console.log).catch(console.error);
