import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';
import { AttendancePhoto } from './attendance-photo.entity';

export enum AttendanceType {
  CLOCK_IN = 'clock_in',
  CLOCK_OUT = 'clock_out',
}

@Entity('attendances')
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee, { eager: true })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ name: 'employee_id' })
  employeeId: number;

  @Column({ type: 'enum', enum: AttendanceType })
  type: AttendanceType;

  @Column({ type: 'datetime' })
  timestamp: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  note: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => AttendancePhoto, (photo) => photo.attendance, {
    eager: true,
  })
  photos: AttendancePhoto[];
}
