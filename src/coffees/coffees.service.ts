import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FlavorsService } from './flavors.service';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Injectable()
export class CoffeesService {
  constructor(
    private prisma: PrismaService,
    private flavorsService: FlavorsService,
  ) {}

  findAll() {
    return this.prisma.coffee.findMany({ include: { flavors: true } });
  }

  async findOne(id: number) {
    const coffee = await this.prisma.coffee.findUnique({
      where: {
        id: id,
      },
      include: {
        flavors: true,
      },
    });

    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffee;
  }

  async create(createCoffeeDto: CreateCoffeeDto) {
    const flavorNames = createCoffeeDto.flavors.map(
      (createFlavorDto) => createFlavorDto.name,
    );

    const flavorsIds =
      await this.flavorsService.preloadFlavorByName(flavorNames);

    return this.prisma.coffee.create({
      data: {
        ...createCoffeeDto,
        flavors: {
          connect: [...flavorsIds],
        },
      },
      include: { flavors: true },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update(id: number, updateCoffeeDto: UpdateCoffeeDto) {
    const flavorNames = updateCoffeeDto.flavors.map(
      (createFlavorDto) => createFlavorDto.name,
    );

    const flavorsIds =
      await this.flavorsService.preloadFlavorByName(flavorNames);

    return this.prisma.coffee.update({
      where: { id: id },
      data: {
        ...updateCoffeeDto,
        flavors: {
          set: [...flavorsIds],
        },
      },
      include: { flavors: true },
    });
  }

  remove(id: number) {
    return this.prisma.coffee.delete({
      where: { id: Number(id) },
    });
  }
}
