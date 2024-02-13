import { Module } from '@nestjs/common';
import { CoffeeRatingService } from './coffee-rating.service';
import { CoffeesModule } from '../coffees/coffees.module';

@Module({
  imports: [CoffeesModule],
  providers: [CoffeeRatingService],
  exports: [CoffeeRatingService],
})
export class CoffeeRatingModule {}
