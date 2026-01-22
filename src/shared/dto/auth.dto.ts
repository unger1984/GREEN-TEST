import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const AuthDtoScheme = z.object({
	instance: z.string().describe('Идентификатор инстанса'),
	token: z.string().describe('Токен'),
});

export class AuthDto extends createZodDto(AuthDtoScheme) {}
