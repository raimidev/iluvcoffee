import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from "@nestjs/common";

@Controller('coffees')
export class CoffeesController {
  @Get()
  findAll() {
    return 'This action returns all coffees';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns #${id} coffee`;
  }

  @Post()
  @HttpCode(HttpStatus.GONE)
  create(@Body('name') name: string, @Body('description') description: string) {
    return { name, description };
  }
}
