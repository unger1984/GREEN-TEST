import { patchNestjsSwagger } from '@anatine/zod-nestjs';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { readFileSync } from 'fs';

import { AppModule } from './app.module';
import { ConfigService } from './shared/config/config.service';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { LogFactory } from './shared/log/log.factory';

async function bootstrap() {
	const log = LogFactory.create('App');

	process.on('uncaughtException', exception => {
		log.e(exception);
	});

	const configApp = await NestFactory.create(AppModule, { logger: log });
	const configService = configApp.get(ConfigService);

	const app = await NestFactory.create(AppModule, {
		httpsOptions:
			configService.env === 'local'
				? {
						key: readFileSync('certs/key.pem'),
						cert: readFileSync('certs/chain.pem'),
					}
				: undefined,
		logger: log,
	});

	await configApp.close();

	app.useGlobalInterceptors(new LoggingInterceptor());

	app.enableCors();

	app.setGlobalPrefix('/api');

	if (configService.env === 'local') {
		// Получаем экземпляр Express-приложения
		const server = app.getHttpAdapter().getInstance(); // Теперь получаем instance через HttpAdapter

		// Обслуживаем статику через отдельный route handler
		server.use('/', express.static(configService.server.staticPath));
	}

	// Патчинг Swagger
	patchNestjsSwagger();
	const config = new DocumentBuilder()
		.setTitle('GREEN-TEST API')
		.setDescription('API documentation for GREEN-TEST backend')
		.setVersion('1.0')
		.addBearerAuth()
		// .addTag('positions')
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('docs', app, document, { swaggerUrl: '/docs/json' });

	await app
		.listen(configService.server.port)
		.then(async () => {
			log.i(
				`API сервер запущен на https://${configService.server.host === '0.0.0.0' ? 'localhost' : configService.server.host}:${configService.server.port}`,
			);
		})
		.catch(exception => {
			log.e(exception);
		});
}
bootstrap();
