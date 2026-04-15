import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { AttendancePhoto } from './entities/attendance-photo.entity';
import { AttendancesService } from './attendances.service';
import { AttendancesController } from './attendances.controller';
import { EmployeesModule } from '../employees/employees.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attendance, AttendancePhoto]),
    EmployeesModule,
  ],
  providers: [AttendancesService],
  controllers: [AttendancesController],
})
export class AttendancesModule {}
