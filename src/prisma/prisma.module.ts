import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaModule as BasePrismaMod } from 'nestjs-prisma';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule extends BasePrismaMod {}
