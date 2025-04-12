import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Configuração de ambiente
  const nodeEnv = configService.get('app.nodeEnv');
  const port = configService.get('app.port');
  const apiPrefix = configService.get('app.apiPrefix');
  const apiVersion = configService.get('app.apiVersion');
  const globalPrefix = `${apiPrefix}/${apiVersion}`;
  
  // Prefixo global para todas as rotas
  app.setGlobalPrefix(globalPrefix);
  
  // Middleware de segurança
  app.use(helmet());
  
  // Configuração de CORS
  app.enableCors({
    origin: nodeEnv === 'production' ? [/\.yourdomain\.com$/] : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });
  
  // Validação de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades não decoradas
      forbidNonWhitelisted: true, // Rejeita propriedades não decoradas
      transform: true, // Transforma tipos automaticamente
    }),
  );
  
  // Documentação Swagger/OpenAPI
  if (nodeEnv !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Gestor Fácil de Assinaturas API')
      .setDescription('API para o sistema Gestor Fácil de Assinaturas')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }
  
  // Iniciar o servidor
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/${globalPrefix}`);
  if (nodeEnv !== 'production') {
    console.log(`Swagger documentation is available at: http://localhost:${port}/api/docs`);
  }
}

bootstrap();
