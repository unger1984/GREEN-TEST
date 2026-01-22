import { Inject, Injectable } from '@nestjs/common';

import { Config } from './config';
import { ConfigServer } from './config-server';
import { MODULE_OPTIONS_TOKEN } from './config.module-defenition';

@Injectable()
export class ConfigService {
	constructor(@Inject(MODULE_OPTIONS_TOKEN) private config: Config) {}

	public get cfg(): Config {
		return this.config;
	}

	public get env(): string {
		return this.config.env;
	}

	public get server(): ConfigServer {
		return this.config.server;
	}
}
