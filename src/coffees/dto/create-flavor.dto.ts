import { IsString } from 'class-validator';
export class CreateFlavorDtoDto {
  @IsString()
  readonly name: string;
}
