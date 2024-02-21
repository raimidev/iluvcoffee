import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Flavor } from '@prisma/client';

@Injectable()
export class FlavorsService {
  constructor(private prisma: PrismaService) {}

  async preloadFlavorByName(
    names: string | string[],
  ): Promise<{ id: number }[]> {
    let newFlavors: string[] = [];
    let createdNewFlavors: Flavor[] = [];
    const existingFlavors = await this.prisma.flavor.findMany({
      where: {
        OR:
          names instanceof Array
            ? names.map((name) => {
                return { name: name };
              })
            : [{ name: names }],
      },
    });

    if (names instanceof Array) {
      newFlavors = names.filter((name) => {
        return !existingFlavors.some((flavor) => flavor.name === name);
      });
    }

    if (newFlavors.length > 0) {
      createdNewFlavors = await Promise.all(
        newFlavors.map(async (name) => {
          return this.prisma.flavor
            .create({ data: { name } })
            .then((flavor) => flavor);
        }),
      );
    }

    return [...createdNewFlavors, ...existingFlavors].map((flavor) => {
      return {
        id: flavor.id,
      };
    });
  }
}
