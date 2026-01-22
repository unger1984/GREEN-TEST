import { parse } from 'dotenv';
import { readFileSync } from 'fs';
import process from 'node:process';

import { LogFactory } from '../log/log.factory';
import { Config } from './config';
import { ConfigServer } from './config-server';

const defaultConfig: { [key: string]: string | null } = {
	ENV: null,
	SERVER_HOST: '0.0.0.0',
	SERVER_PORT: '8080',
	SERVER_URL: null,
	SERVER_STATIC_PATH: './static',
};

export class ConfigFactory implements Config {
	constructor(
		public readonly env: string,
		public readonly server: ConfigServer,
	) {}

	public static read(): ConfigFactory {
		const log = LogFactory.create('readConfig');
		log.i('Читаю конфиг');

		const dotenv = parse(readFileSync(`.env`));

		LogFactory.setLevel(dotenv.ENV === 'production' ? 'info' : 'silly');

		let isError = false;
		for (const key of Object.keys(defaultConfig)) {
			if (!dotenv[key]) {
				if (!defaultConfig[key]) {
					isError = true;
					log.e(
						`Для ключа "${key}" не определено значение по умолчанию, дальнейшая работа приложения невозможна. Список ключей в .env.sample`,
					);
				} else {
					log.w(
						`В .env не задано значение для ключа "${key}", испольуется значение по умолчанию "${defaultConfig[key]}"`,
					);
					dotenv[key] = defaultConfig[key]!;
				}
			}
		}
		if (isError) {
			process.exit(1);
		}

		const server = new ConfigServer(
			dotenv.SERVER_HOST,
			parseInt(dotenv.SERVER_PORT),
			dotenv.SERVER_URL,
			dotenv.SERVER_STATIC_PATH,
		);

		const config = new ConfigFactory(dotenv.ENV, server);
		log.d('Config', config);
		log.i('Конфиг прочитан успешно');

		return config;
	}
}
