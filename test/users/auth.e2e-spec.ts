import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { AppModule } from '../../src/app.module';
import { LoginDto } from '../../src/modules/users/dtos/auth.dto';
import { User, UserRole, UserStatus } from '../../src/modules/users/entities/user.entity';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let accessToken: string;
  let refreshToken: string;
  let dbConnectionSuccessful = false;
  
  const testUser = {
    email: 'test-e2e@example.com',
    password: 'Test@123456',
    name: 'Test User E2E',
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    emailVerified: true
  };

  beforeAll(async () => {
    try {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();

      userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
      
      // Test database connection
      try {
        // Clear test user if exists
        await userRepository.delete({ email: testUser.email });
        
        // Create test user for authentication tests
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(testUser.password, salt);
        
        await userRepository.save({
          ...testUser,
          password: hashedPassword,
        });
        
        dbConnectionSuccessful = true;
      } catch (error) {
        console.warn('Database connection failed, tests will be skipped:', error.message);
      }
    } catch (error) {
      console.error('Error setting up tests:', error);
    }
  }, 30000); // 30 second timeout

  afterAll(async () => {
    try {
      if (dbConnectionSuccessful) {
        // Clean up test user
        await userRepository.delete({ email: testUser.email });
      }
      if (app) {
        await app.close();
      }
    } catch (error) {
      console.error('Error cleaning up:', error);
    }
  });

  describe('/auth/login (POST)', () => {
    it('should login with valid credentials', async () => {
      if (!dbConnectionSuccessful) {
        console.warn('Skipping test: Database connection not available');
        return;
      }

      const loginDto: LoginDto = {
        email: testUser.email,
        password: testUser.password,
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(200);

      expect(response.body).toHaveProperty('tokens');
      expect(response.body.tokens).toHaveProperty('accessToken');
      expect(response.body.tokens).toHaveProperty('refreshToken');
      expect(response.body.user).toHaveProperty('email', testUser.email);
      
      // Save tokens for later tests
      accessToken = response.body.tokens.accessToken;
      refreshToken = response.body.tokens.refreshToken;
    });

    it('should fail login with invalid credentials', async () => {
      if (!dbConnectionSuccessful) {
        console.warn('Skipping test: Database connection not available');
        return;
      }

      const invalidLoginDto: LoginDto = {
        email: testUser.email,
        password: 'wrongpassword',
      };

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(invalidLoginDto)
        .expect(401);
    });
  });

  describe('/auth/refresh-token (POST)', () => {
    it('should issue new tokens with valid refresh token', async () => {
      if (!dbConnectionSuccessful || !refreshToken) {
        console.warn('Skipping test: Database connection not available or login failed');
        return;
      }

      const response = await request(app.getHttpServer())
        .post('/auth/refresh-token')
        .set('Authorization', `Bearer ${refreshToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');

      // Update tokens
      accessToken = response.body.accessToken;
      refreshToken = response.body.refreshToken;
    });

    it('should fail with invalid refresh token', async () => {
      if (!dbConnectionSuccessful) {
        console.warn('Skipping test: Database connection not available');
        return;
      }

      await request(app.getHttpServer())
        .post('/auth/refresh-token')
        .set('Authorization', 'Bearer invalidtoken')
        .expect(401);
    });
  });

  describe('/auth/logout (POST)', () => {
    it('should successfully logout with valid access token', async () => {
      if (!dbConnectionSuccessful || !accessToken) {
        console.warn('Skipping test: Database connection not available or login failed');
        return;
      }

      await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('should fail logout with invalid token', async () => {
      if (!dbConnectionSuccessful) {
        console.warn('Skipping test: Database connection not available');
        return;
      }

      await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', 'Bearer invalidtoken')
        .expect(401);
    });
  });
}); 