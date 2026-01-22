import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const MessageFileDtoScheme = z.object({
	chatId: z.string().describe('Идентификатор чата'),
	urlFile: z.string().describe('Ссылка на отправляемый файл'),
	fileName: z.string().describe('Название файла'),
	caption: z.string().max(20000).describe('Описание под файлом').optional(),
	quotedMessageId: z.string().describe('Идентификатор цитируемого сообщения').optional(),
	typingTime: z
		.number()
		.min(1000)
		.max(20000)
		.describe('Время показа уведомления набора сообщения в чате собеседника.')
		.optional(),
	typingType: z.string().describe('Тип набора сообщения').optional(),
});

export class MessageFileDto extends createZodDto(MessageFileDtoScheme) {}
