import winston from 'winston';

import { Logger } from './logger';
import { LoggerWinston } from './logger.winston';

export class LogFactory {
	private static _logger: winston.Logger;

	public static setLevel(level: string): void {
		LogFactory._logger.transports.forEach(transport => {
			transport.level = level;
		});
	}

	private static _errorHandler(error: any): string {
		if (error instanceof Error) {
			return `${error.constructor.name} ${error.stack}`;
		}
		return JSON.stringify(error, null, 2);
	}

	public static create(name: string): Logger {
		if (!LogFactory._logger) {
			LogFactory._logger = winston.createLogger({
				transports: [
					new winston.transports.Console({
						level: 'silly',
						handleExceptions: true,
						format: winston.format.combine(
							winston.format.printf(info => {
								const { level, message, label, ...args } = info;
								let msg = message;
								if (Array.isArray(message)) {
									const [first, ...other] = message;
									msg = other
										.map(itm =>
											typeof itm === 'string' || itm instanceof String
												? itm
												: JSON.stringify(itm),
										)
										.reduce(
											(prev, next) => (next ? `${prev}, ${next}` : prev),
											typeof first === 'string' || first instanceof String
												? first
												: level === 'error'
													? this._errorHandler(first)
													: JSON.stringify(first, null, 2),
										);
								}
								const coloredLevel = winston.format
									.colorize({ all: true })
									.colorize(level, `[${level.substring(0, 1).toUpperCase()}]`);
								return `${coloredLevel}${label ? ` {${label}}` : ''}: ${msg} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`;
							}),
						),
					}),
				],
				exitOnError: false,
			});
		}

		return new LoggerWinston(LogFactory._logger.child({ label: name }));
	}
}
