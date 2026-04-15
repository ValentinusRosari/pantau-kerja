import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { AttendancesService } from './attendances.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { multerConfig } from '../common/multer.config';

@ApiTags('Attendances')
@ApiBearerAuth()
@Controller('api/v1/attendances')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) {}

  @Post('clock-in')
  @Roles('employee')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('photo', multerConfig))
  async clockIn(
    @CurrentUser() user: { id: number },
    @UploadedFile() file: Express.Multer.File,
    @Body('note') note?: string,
  ) {
    return this.attendancesService.clockIn(user.id, file, note);
  }

  @Post('clock-out')
  @Roles('employee')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('photo', multerConfig))
  async clockOut(
    @CurrentUser() user: { id: number },
    @UploadedFile() file: Express.Multer.File,
    @Body('note') note?: string,
  ) {
    return this.attendancesService.clockOut(user.id, file, note);
  }

  @Get('today')
  @Roles('employee')
  async getTodayStatus(@CurrentUser() user: { id: number }) {
    return this.attendancesService.getTodayStatus(user.id);
  }

  @Get('my')
  @Roles('employee')
  async getMyHistory(
    @CurrentUser() user: { id: number },
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.attendancesService.getMyHistory(user.id, { page, limit });
  }

  @Get()
  @Roles('admin')
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('employee_id') employeeId?: number,
    @Query('date_from') dateFrom?: string,
    @Query('date_to') dateTo?: string,
    @Query('search') search?: string,
  ) {
    return this.attendancesService.findAll({
      page,
      limit,
      employeeId,
      dateFrom,
      dateTo,
      search,
    });
  }

  @Get(':id')
  @Roles('admin')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.attendancesService.findOne(id);
  }
}
