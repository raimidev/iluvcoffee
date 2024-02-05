import { IsString, ValidateNested } from 'class-validator';
import { CreateFlavorDtoDto } from './create-flavor.dto';
export class CreateCoffeeDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly brand: string;

  @ValidateNested({ each: true })
  readonly flavors?: CreateFlavorDtoDto[];
}
