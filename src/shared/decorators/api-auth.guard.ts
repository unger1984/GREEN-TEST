import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthDtoScheme } from '../dto/auth.dto';

@Injectable()
export class ApiAuthGuard implements CanActivate {
	canActivate(ctx: ExecutionContext): boolean {
		const req = ctx.switchToHttp().getRequest();
		const raw = req.headers['x-api-auth'];

		if (!raw) {
			throw new UnauthorizedException('X-API-AUTH header is required');
		}

		try {
			const binary = atob(raw);
			const json = new TextDecoder().decode(Uint8Array.from(binary, c => c.charCodeAt(0)));

			const parsed = AuthDtoScheme.parse(JSON.parse(json));
			req.apiAuth = parsed;

			return true;
		} catch {
			throw new UnauthorizedException('Invalid X-API-AUTH header');
		}
	}
}
