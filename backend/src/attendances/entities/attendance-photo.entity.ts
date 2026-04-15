import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Attendance } from './attendance.entity';

@Entity('attendance_photos')
export class AttendancePhoto {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Attendance, (attendance) => attendance.photos)
  @JoinColumn({ name: 'attendance_id' })
  attendance: Attendance;

  @Column({ name: 'attendance_id' })
  attendanceId: number;

  @Column({ name: 'file_path', type: 'varchar', length: 255 })
  filePath: string;

  @Column({ name: 'original_name', type: 'varchar', length: 255 })
  originalName: string;

  @Column({ name: 'file_size', type: 'int' })
  fileSize: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
