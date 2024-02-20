import { Module } from '@nestjs/common';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { PrismaModule } from '../prisma/prisma.module';
import { FlavorsService } from './flavors.service';
import { ConfigModule } from '@nestjs/config';
import coffeesConfig from './config/coffees.config';

@Module({
  controllers: [CoffeesController],
  providers: [CoffeesService, FlavorsService],
  imports: [PrismaModule, ConfigModule, ConfigModule.forFeature(coffeesConfig)],
  exports: [CoffeesService],
})
export class CoffeesModule {}
