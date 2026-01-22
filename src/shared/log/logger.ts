/* eslint-disable @typescript-eslint/no-unused-vars */
import { LogLevel, LoggerService } from '@nestjs/common';

export abstract class Logger implements LoggerService {
	public abstract i(...args: any[]): void;
	public abstract d(...args: any[]): void;
	public abstract w(...args: any[]): void;
	public abstract e(...args: any[]): void;

	public log(message: any, ...optionalParams: any[]) {
		this.i(message);
	}
	public error(message: any, ...optionalParams: any[]) {
		this.e(message, optionalParams);
	}
	public warn(message: any, ...optionalParams: any[]) {
		this.w(message);
	}
	public debug?(message: any, ...optionalParams: any[]) {
		this.d(message);
	}
	public verbose?(message: any, ...optionalParams: any[]) {
		this.i(message);
	}
	public fatal?(message: any, ...optionalParams: any[]) {
		this.e(message);
	}
	public setLogLevels?(levels: LogLevel[]) {
		throw new Error('Method not implemented.');
	}
}
