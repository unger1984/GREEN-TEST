import { HttpException, Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import https from 'https';
import { stringify } from 'qs';

import { ConfigService } from '../config/config.service';
import { LogFactory } from '../log/log.factory';
import { RestClientService } from './rest-client.service';

@Injectable()
export class RestClientAxiosService extends RestClientService {
	private readonly log = LogFactory.create('RestClientAxios');

	private readonly agent = new https.Agent({
		rejectUnauthorized: false,
	});

	private sendData = <T>(res: AxiosResponse<T>): T => res.data;

	constructor(private readonly config: ConfigService) {
		super();
		axios.defaults.paramsSerializer = (params: any): string => stringify(params, { encode: false });
		axios.defaults.httpsAgent = this.agent;
	}

	public override async get<T>(url: string, params?: any): Promise<T> {
		this.log.i(`GET ${url} request`);
		try {
			const res = await axios.get<T>(url, params);
			const parsed = this.sendData<T>(res);
			this.log.i(`GET ${url} response`, parsed);
			return parsed;
		} catch (err: any) {
			if (err.response) {
				throw new HttpException(err.response.data, err.response.status);
			}
			throw err;
		}
	}

	public override async delete<T>(url: string, params?: any): Promise<T> {
		this.log.i(`DELETE ${url} request`);
		try {
			const res = await axios.delete<T>(url, params);
			const parsed = this.sendData<T>(res);
			this.log.i(`DELETE ${url} response`, parsed);
			return parsed;
		} catch (err: any) {
			if (err.response) {
				throw new HttpException(err.response.data, err.response.status);
			}
			throw err;
		}
	}

	public override async post<T, D = any>(url: string, data?: D, params?: any): Promise<T> {
		this.log.i(`POST ${url} request`, data, params);
		try {
			const res = await axios.post<T>(url, data, params);
			const parsed = this.sendData<T>(res);
			this.log.i(`POST ${url} response`, parsed);
			return parsed;
		} catch (err: any) {
			// Если есть ответ от сервера
			if (err.response) {
				throw new HttpException(err.response.data, err.response.status);
			}
			// иначе пробрасываем как есть
			throw err;
		}
	}

	public override async put<T, D = any>(url: string, data?: D, params?: any): Promise<T> {
		this.log.i(`PUT ${url} request`, data, params);
		try {
			const res = await axios.put<T>(url, data, params);
			const parsed = this.sendData<T>(res);
			this.log.i(`PUT ${url} response`, parsed);
			return parsed;
		} catch (err: any) {
			if (err.response) {
				throw new HttpException(err.response.data, err.response.status);
			}
			throw err;
		}
	}
}
