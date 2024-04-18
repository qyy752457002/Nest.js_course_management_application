import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { TasksController } from './tasks.controller';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    // 导入 TypeORM 模块并为其提供 TasksRepository
    TypeOrmModule.forFeature([TasksRepository]),
    // 导入认证模块
    AuthModule
  ],
  // 控制器数组，包含 TasksController
  controllers: [TasksController],
  // 服务数组，包含 TasksService
  providers: [TasksService],
})
export class TasksModule {} 
