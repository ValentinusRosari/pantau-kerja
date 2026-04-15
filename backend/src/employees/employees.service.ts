import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeesRepository: Repository<Employee>,
    private readonly usersService: UsersService,
  ) {}

  private async generateEmployeeCode(): Promise<string> {
    const lastEmployee = await this.employeesRepository.find({
      order: { id: 'DESC' },
      take: 1,
    });
    const nextNumber = lastEmployee.length > 0 ? lastEmployee[0].id + 1 : 1;
    return `EMP-${nextNumber.toString().padStart(3, '0')}`;
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    search?: string;
    department?: string;
    position?: string;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (query.search) {
      where.fullName = Like(`%${query.search}%`);
    }
    if (query.department) {
      where.department = query.department;
    }
    if (query.position) {
      where.position = query.position;
    }

    const [data, total] = await this.employeesRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<Employee> {
    const employee = await this.employeesRepository.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    return employee;
  }

  async findByUserId(userId: number): Promise<Employee | null> {
    return this.employeesRepository.findOne({ where: { userId } });
  }

  async create(dto: CreateEmployeeDto): Promise<Employee> {
    const existingEmail = await this.employeesRepository.findOne({
      where: { email: dto.email },
    });
    if (existingEmail) {
      throw new ConflictException('Email sudah terdaftar');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      username: dto.username,
      password: hashedPassword,
      role: UserRole.EMPLOYEE,
    });

    const employeeCode = await this.generateEmployeeCode();

    const employee = this.employeesRepository.create({
      userId: user.id,
      employeeCode,
      fullName: dto.fullName,
      email: dto.email,
      phone: dto.phone,
      department: dto.department,
      position: dto.position,
      joinDate: dto.joinDate ? new Date(dto.joinDate) : undefined,
    });

    return this.employeesRepository.save(employee);
  }

  async update(id: number, dto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.findOne(id);
    Object.assign(employee, dto);
    return this.employeesRepository.save(employee);
  }

  async remove(id: number): Promise<void> {
    const employee = await this.findOne(id);
    employee.isActive = false;
    await this.employeesRepository.save(employee);
  }
}
