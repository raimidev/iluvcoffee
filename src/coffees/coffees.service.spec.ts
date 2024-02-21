import { Test, TestingModule } from '@nestjs/testing';
import { CoffeesService } from './coffees.service';
import { FlavorsService } from './flavors.service';
import { PrismaService } from '../prisma/prisma.service';
import { prismaMock } from '../../singleton';
import { DeepMockProxy } from 'jest-mock-extended';
import { NotFoundException } from '@nestjs/common';

describe('CoffeesService', () => {
  let service: CoffeesService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoffeesService,
        {
          provide: FlavorsService,
          useValue: {},
        },
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<CoffeesService>(CoffeesService);
    prisma = module.get<DeepMockProxy<PrismaService>>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    describe('when coffee with ID exists', () => {
      it('should return the coffee object', async () => {
        // const coffeeId = 1;
        const expectedCoffee = {
          id: 1,
          name: 'Coffee #1',
          brand: 'Brand #1',
          recommendations: 0,
          flavors: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        prisma.coffee.findUnique.mockResolvedValue(expectedCoffee);
        const coffee = await service.findOne(expectedCoffee.id);

        expect(coffee).toEqual(expectedCoffee);
      });
    });
    describe('otherwise', () => {
      it('should throw the "NotFoundException"', async () => {
        const coffeeId = 1;
        prisma.coffee.findUnique.mockResolvedValue(null);

        try {
          await service.findOne(coffeeId);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`Coffee #${coffeeId} not found`);
        }
      });
    });
  });
});
