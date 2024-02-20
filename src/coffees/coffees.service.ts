import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FlavorsService } from './flavors.service';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Coffee } from '@prisma/client';
import { ConfigService, ConfigType } from '@nestjs/config';
import coffeesConfig from './config/coffees.config';

@Injectable()
export class CoffeesService {
  constructor(
    private prisma: PrismaService,
    private flavorsService: FlavorsService,
    @Inject(coffeesConfig.KEY)
    private configService: ConfigType<typeof coffeesConfig>,
  ) {}

  findAll(paginationQuery: PaginationQueryDto) {
    return this.prisma.coffee.findMany({
      include: { flavors: true },
      take: paginationQuery.limit,
      skip: paginationQuery.offset,
    });
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

  async recommendCoffee(coffee: Coffee) {
    const test = await this.prisma.$transaction(async (tx) => {
      coffee.recommendations++;
      await tx.event.create({
        data: {
          name: 'recommend_coffee',
          type: 'coffee',
          payload: {
            coffeeId: coffee.id,
          },
        },
      });
      await tx.coffee.update({
        where: { id: coffee.id },
        data: {
          recommendations: coffee.recommendations,
        },
      });
      return coffee;
    });

    return test;
  }
}
