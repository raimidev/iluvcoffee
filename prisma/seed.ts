import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const coffee1 = await prisma.coffee.create({
    data: {
      name: 'Shipwreck Roast',
      brand: 'Buddy Brew',
      flavors: {
        create: [
          {
            name: 'chocolate',
          },
          {
            name: 'vanilla',
          },
        ],
      },
    },
  });

  const coffee2 = await prisma.coffee.create({
    data: {
      name: 'Sailor’s Brew',
      brand: 'Buddy Brew',
      flavors: {
        create: [
          {
            name: 'caramel',
          },
          {
            name: 'mocha',
          },
        ],
      },
    },
  });

  console.log({ coffee1, coffee2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
