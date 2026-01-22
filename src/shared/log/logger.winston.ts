import winston from 'winston';

import { Logger } from './logger';

export class LoggerWinston extends Logger {
	private _logger: winston.Logger;

	constructor(logger: winston.Logger) {
		super();
		this._logger = logger;
	}

	public i(...args: any[]): void {
		this._logger.info(args);
	}
	public d(...args: any[]): void {
		this._logger.debug(args);
	}
	public w(...args: any[]): void {
		this._logger.warn(args);
	}
	public e(...args: any[]): void {
		this._logger.error(args);
	}
}
