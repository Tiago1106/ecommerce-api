import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('API Produtos')
    .setDescription('Documentação da API de produtos e categorias')
    .setVersion('1.0')
    .addServer('/api/v1')
    .build();

  app.use(
    cors({
      origin: '*', // Substitua pela porta correta se necessário
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    }),
  );

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // acessível em /docs

  const port = process.env.PORT || 3002;

  await app.listen(port); // A aplicação está rodando na porta 3002
}
bootstrap();
