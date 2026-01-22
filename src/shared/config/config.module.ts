import { Global, Module } from '@nestjs/common';

import { ConfigurableModuleClass } from './config.module-defenition';
import { ConfigService } from './config.service';

@Global()
@Module({
	providers: [ConfigService],
	exports: [ConfigService],
})
export class ConfigModule extends ConfigurableModuleClass {}
