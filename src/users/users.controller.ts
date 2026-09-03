import { Controller, Get, Post, Query, Param, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { SearchUserDto } from './dto/search-user.dto';

@ApiTags('users')
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search LinkedIn users by keyword, industry, company, or location' })
  @ApiQuery({ name: 'keyword', required: false, example: 'engineer' })
  @ApiQuery({ name: 'industry', required: false, example: 'technology' })
  @ApiQuery({ name: 'skill', required: false, example: 'python' })
  @ApiQuery({ name: 'company', required: false, example: 'Google' })
  @ApiQuery({ name: 'location', required: false, example: 'Texas' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Search results' })
  async search(@Query() dto: SearchUserDto) {
    if (dto.limit && dto.limit > 100) {
      throw new BadRequestException('Limit cannot exceed 100');
    }
    return this.usersService.search(dto);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get statistics about all users' })
  @ApiResponse({ status: 200, description: 'User statistics' })
  async getStatistics() {
    return this.usersService.getStatistics();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single user by ID' })
  @ApiResponse({ status: 200, description: 'User details' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param('id') id: string) {
    if (!id) throw new BadRequestException('ID is required');
    const user = await this.usersService.getUserById(id);
    if (!user) throw new Error('User not found');
    return user;
  }
}
