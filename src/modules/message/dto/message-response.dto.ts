import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const MessageResponseDtoScheme = z.object({
	idMessage: z.string().describe('Идентификатор сообщения'),
});

export class MessageResponseDto extends createZodDto(MessageResponseDtoScheme) {}
