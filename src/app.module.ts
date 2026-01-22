import { MiddlewareConsumer, Module } from '@nestjs/common';

import { ConfigFactory } from './shared/config/config.factory';
import { ConfigModule } from './shared/config/config.module';
import { RequestIdMiddleware } from './shared/middlewares/request-id.middleware';
import { RestClientModule } from './shared/rest-client/rest-client.module';

@Module({
	imports: [
		ConfigModule.registerAsync({
			isGlobal: true,
			useFactory: async () => ConfigFactory.read(),
		}),
		RestClientModule,
	],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(RequestIdMiddleware).forRoutes('*');
	}
}
