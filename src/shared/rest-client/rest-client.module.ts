import { Global, Module } from '@nestjs/common';

import { RestClientAxiosService } from './rest-client-axios.service';
import { RestClientService } from './rest-client.service';

@Global()
@Module({
	providers: [
		{
			provide: RestClientService,
			useClass: RestClientAxiosService,
		},
	],
	exports: [RestClientService],
})
export class RestClientModule {}
