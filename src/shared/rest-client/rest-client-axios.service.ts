import { Injectable } from '@nestjs/common';
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
		return axios
			.get<T>(url, params)
			.catch(err => {
				throw err;
			})
			.then(this.sendData<T>)
			.then(res => {
				this.log.i(`GET ${url} response`, res);

				return res;
			});
	}

	public override async delete<T>(url: string, params?: any): Promise<T> {
		this.log.i(`DELETE ${url} request`);
		return axios
			.delete<T>(url, params)
			.catch(err => {
				throw err;
			})
			.then(this.sendData<T>)
			.then(res => {
				this.log.i(`DELETE ${url} response`, res);

				return res;
			});
	}

	public override async post<T, D = any>(url: string, data?: D, params?: any): Promise<T> {
		this.log.i(`POST ${url} request`, data, params);
		return axios
			.post<T>(url, data, params)
			.catch(err => {
				throw err;
			})
			.then(this.sendData<T>)
			.then(res => {
				this.log.i(`POST ${url} response`, res);

				return res;
			});
	}

	public override async put<T, D = any>(url: string, data?: D, params?: any): Promise<T> {
		this.log.i(`PUT ${url} request`, data, params);
		return axios
			.put<T>(url, data, params)
			.catch(err => {
				throw err;
			})
			.then(this.sendData<T>)
			.then(res => {
				this.log.i(`PUT ${url} response`, res);

				return res;
			});
	}
}
