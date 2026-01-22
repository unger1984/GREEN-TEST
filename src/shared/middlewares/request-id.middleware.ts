// request-id.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { customAlphabet } from 'nanoid';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
	use(req: Request, __: Response, next: NextFunction) {
		req.id = `req-${customAlphabet('1234567890', 5)()}`;
		next();
	}
}
