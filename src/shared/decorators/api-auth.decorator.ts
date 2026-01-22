import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';

import { AuthDtoScheme } from '../dto/auth.dto';

export const ApiAuth = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
	const req = ctx.switchToHttp().getRequest();
	const raw = req.headers['x-api-auth'];

	if (!raw) {
		throw new BadRequestException('X-API-AUTH header is required');
	}

	try {
		// base64 -> binary string
		const binary = atob(raw);

		// binary string -> Uint8Array -> UTF-8 string
		const jsonString = new TextDecoder().decode(Uint8Array.from(binary, c => c.charCodeAt(0)));

		const parsed = JSON.parse(jsonString);

		// валидируем через Zod
		AuthDtoScheme.parse(parsed);

		return parsed;
	} catch {
		throw new BadRequestException('Invalid X-API-AUTH header format');
	}
});
