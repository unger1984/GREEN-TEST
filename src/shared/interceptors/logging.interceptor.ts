import { CallHandler, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

import { LogFactory } from '../log/log.factory';

@Injectable()
export class LoggingInterceptor {
	private readonly log = LogFactory.create('HTTP');

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const req = context.switchToHttp().getRequest();
		const { method, url, body, params, query, id } = req;
		const now = Date.now();

		this.log.i(
			`${id} ${method} ${url} starting ${body ? 'body=' + JSON.stringify(body) + ' ' : ''} ${params ? 'params=' + JSON.stringify(params) + ' ' : ''} ${query ? 'query=' + JSON.stringify(query) + ' ' : ''}`,
		);

		return next
			.handle()
			.pipe(
				tap(responseBody =>
					this.log.i(
						`${id} ${method} ${url} done ${Date.now() - now}ms ${responseBody ? 'body=' + JSON.stringify(responseBody) + ' ' : ''}`,
					),
				),
			);
	}
}
