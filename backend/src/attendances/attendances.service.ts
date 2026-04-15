import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import {
  Attendance,
  AttendanceType,
} from './entities/attendance.entity';
import { AttendancePhoto } from './entities/attendance-photo.entity';
import { EmployeesService } from '../employees/employees.service';

@Injectable()
export class AttendancesService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendancesRepository: Repository<Attendance>,
    @InjectRepository(AttendancePhoto)
    private readonly photosRepository: Repository<AttendancePhoto>,
    private readonly employeesService: EmployeesService,
  ) {}

  private getToday(): { start: Date; end: Date } {
    const now = new Date();
    const start = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
    );
    const end = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
    );
    return { start, end };
  }

  async clockIn(userId: number, file: Express.Multer.File, note?: string) {
    const employee = await this.employeesService.findByUserId(userId);
    if (!employee) {
      throw new NotFoundException('Employee profile not found');
    }

    const { start, end } = this.getToday();
    const existingClockIn = await this.attendancesRepository.findOne({
      where: {
        employeeId: employee.id,
        type: AttendanceType.CLOCK_IN,
        timestamp: Between(start, end),
      },
    });

    if (existingClockIn) {
      throw new BadRequestException('Kamu sudah clock in hari ini');
    }

    const attendance = this.attendancesRepository.create({
      employeeId: employee.id,
      type: AttendanceType.CLOCK_IN,
      timestamp: new Date(),
      note,
    });
    const savedAttendance = await this.attendancesRepository.save(attendance);

    if (file) {
      const photo = this.photosRepository.create({
        attendanceId: savedAttendance.id,
        filePath: `/uploads/${file.filename}`,
        originalName: file.originalname,
        fileSize: file.size,
      });
      await this.photosRepository.save(photo);
    }

    return this.attendancesRepository.findOne({
      where: { id: savedAttendance.id },
      relations: ['photos'],
    });
  }

  async clockOut(userId: number, file: Express.Multer.File, note?: string) {
    const employee = await this.employeesService.findByUserId(userId);
    if (!employee) {
      throw new NotFoundException('Employee profile not found');
    }

    const { start, end } = this.getToday();

    const existingClockIn = await this.attendancesRepository.findOne({
      where: {
        employeeId: employee.id,
        type: AttendanceType.CLOCK_IN,
        timestamp: Between(start, end),
      },
    });
    if (!existingClockIn) {
      throw new BadRequestException('Kamu belum clock in hari ini');
    }

    const existingClockOut = await this.attendancesRepository.findOne({
      where: {
        employeeId: employee.id,
        type: AttendanceType.CLOCK_OUT,
        timestamp: Between(start, end),
      },
    });
    if (existingClockOut) {
      throw new BadRequestException('Kamu sudah clock out hari ini');
    }

    const attendance = this.attendancesRepository.create({
      employeeId: employee.id,
      type: AttendanceType.CLOCK_OUT,
      timestamp: new Date(),
      note,
    });
    const savedAttendance = await this.attendancesRepository.save(attendance);

    if (file) {
      const photo = this.photosRepository.create({
        attendanceId: savedAttendance.id,
        filePath: `/uploads/${file.filename}`,
        originalName: file.originalname,
        fileSize: file.size,
      });
      await this.photosRepository.save(photo);
    }

    return this.attendancesRepository.findOne({
      where: { id: savedAttendance.id },
      relations: ['photos'],
    });
  }

  async getTodayStatus(userId: number) {
    const employee = await this.employeesService.findByUserId(userId);
    if (!employee) {
      throw new NotFoundException('Employee profile not found');
    }

    const { start, end } = this.getToday();
    const attendances = await this.attendancesRepository.find({
      where: {
        employeeId: employee.id,
        timestamp: Between(start, end),
      },
      relations: ['photos'],
      order: { timestamp: 'ASC' },
    });

    const clockIn = attendances.find(
      (a) => a.type === AttendanceType.CLOCK_IN,
    );
    const clockOut = attendances.find(
      (a) => a.type === AttendanceType.CLOCK_OUT,
    );

    return {
      hasClockedIn: !!clockIn,
      hasClockedOut: !!clockOut,
      clockIn: clockIn || null,
      clockOut: clockOut || null,
    };
  }

  async getMyHistory(userId: number, query: { page?: number; limit?: number }) {
    const employee = await this.employeesService.findByUserId(userId);
    if (!employee) {
      throw new NotFoundException('Employee profile not found');
    }

    const page = query.page || 1;
    const limit = query.limit || 20;

    const [data, total] = await this.attendancesRepository.findAndCount({
      where: { employeeId: employee.id },
      relations: ['photos'],
      order: { timestamp: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    employeeId?: number;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 20;

    const qb = this.attendancesRepository
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.employee', 'employee')
      .leftJoinAndSelect('attendance.photos', 'photos')
      .orderBy('attendance.timestamp', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (query.employeeId) {
      qb.andWhere('attendance.employee_id = :employeeId', {
        employeeId: query.employeeId,
      });
    }

    if (query.dateFrom) {
      qb.andWhere('attendance.timestamp >= :dateFrom', {
        dateFrom: query.dateFrom,
      });
    }

    if (query.dateTo) {
      qb.andWhere('attendance.timestamp <= :dateTo', {
        dateTo: query.dateTo + ' 23:59:59',
      });
    }

    if (query.search) {
      qb.andWhere('employee.fullName LIKE :search', {
        search: `%${query.search}%`,
      });
    }

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: number) {
    const attendance = await this.attendancesRepository.findOne({
      where: { id },
      relations: ['employee', 'photos'],
    });
    if (!attendance) {
      throw new NotFoundException(`Attendance with ID ${id} not found`);
    }
    return attendance;
  }
}
