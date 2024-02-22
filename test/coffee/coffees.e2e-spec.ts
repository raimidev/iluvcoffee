import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CoffeesModule } from '../../src/coffees/coffees.module';
import { PrismaModule, PrismaModule as BasePrismaMod } from 'nestjs-prisma';
import * as request from 'supertest';
import { CreateCoffeeDto } from '../../src/coffees/dto/create-coffee.dto';
import prisma from '../../client';

describe('[Feature] Coffees - /coffees', () => {
  const coffee = {
    name: 'Raimir e2e',
    brand: 'Buddy Brew',
    flavors: [{ name: 'chocolate' }, { name: 'vanilla' }],
  };
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CoffeesModule,
        PrismaModule.forRoot({
          prismaServiceOptions: {
            prismaOptions: {
              datasourceUrl: process.env.TEST_DATABASE_URL,
            },
          },
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await app.init();
  });

  it('Create [POST /]', async () => {
    request(app.getHttpServer())
      .post('/coffees')
      .set('Authorization', process.env.API_KEY ?? '')
      .send(coffee as CreateCoffeeDto)
      .expect(HttpStatus.CREATED);
  });
  it('Get all [GET /]', async () => {
    //copilot
    request(app.getHttpServer()).post('/coffees').send(coffee as CreateCoffeeDto)
  });
  test.todo('Get one [GET /:id]');
  test.todo('Update [PATCH /:id]');
  test.todo('Delete [DELETE /:id]');

  afterAll(async () => {
    await app.close();
  });
});
