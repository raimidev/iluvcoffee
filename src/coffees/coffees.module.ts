import { Module } from '@nestjs/common';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { PrismaModule } from '../prisma/prisma.module';
import { FlavorsService } from './flavors.service';

@Module({
  controllers: [CoffeesController],
  providers: [CoffeesService, FlavorsService],
  imports: [PrismaModule],
  exports: [CoffeesService],
})
export class CoffeesModule {}
