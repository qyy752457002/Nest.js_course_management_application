// 导入Test和TestingModule类，用于测试
import { Test, TestingModule } from '@nestjs/testing';
// 导入INestApplication类，用于创建Nest应用
import { INestApplication } from '@nestjs/common';
// 导入supertest库，用于发送HTTP请求
import * as request from 'supertest';
// 导入AppModule类，用于创建Nest应用模块
import { AppModule } from './../src/app.module';

// 描述（用于测试）：AppController（GET请求）
describe('AppController (e2e)', () => {
    // 定义app变量，用于存储Nest应用
    let app: INestApplication;

    // 在每个测试之前执行：初始化Nest应用
    beforeEach(async () => {
        // 使用Test类创建测试模块，并编译
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile(); 

        // 创建Nest应用，并初始化
        app = moduleFixture.createNestApplication();
        await app.init();
    }); 

    // 测试（发送GET请求）：/（GET请求）
    it('/ (GET)', () => {
        // 使用request库发送GET请求，并期望返回状态码为200，返回值为Hello World！
        return request(app.getHttpServer())
            .get('/')
            .expect(200)
            .expect('Hello World!'); 
    });
}); 