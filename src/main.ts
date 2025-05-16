import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('API Produtos')
    .setDescription('Documentação da API de produtos e categorias')
    .setVersion('1.0')
    .build();

  app.use(
    cors({
      origin: 'http://localhost:3000', // Substitua pela porta correta se necessário
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    }),
  );

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); // acessível em /docs

  await app.listen(3002); // A aplicação está rodando na porta 3000
}
bootstrap();
