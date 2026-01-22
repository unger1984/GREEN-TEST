import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export enum PreviewType {
	large = 'large',
	small = 'small',
}

export const CustomPreviewDtoScheme = z.object({
	title: z.string().max(300).describe('Заголовок превью'),
	description: z.string().max(300).describe('Описание').optional(),
	link: z.string().max(300).describe('Доменное имя сайта со ссылкой').optional(),
	urlFile: z.string().describe('Ссылка на файл с картинкой для создания большого превью').optional(),
	jpegThumbnail: z.string().describe('Предпросмотр изображения в base64').optional(),
});

export class CustomPreviewDto extends createZodDto(CustomPreviewDtoScheme) {}

export const MessageDtoScheme = z.object({
	chatId: z.string().describe('Идентификатор чата'),
	message: z.string().max(20000).describe('Сообщение'),
	quotedMessageId: z.string().describe('Идентификатор цитируемого сообщения').optional(),
	linkPreview: z.boolean().describe('Параметр включает отображение превью и описание ссылки').optional(),
	typePreview: z.nativeEnum(PreviewType).describe('Размер превью').optional(),
	customPreview: CustomPreviewDtoScheme.describe('Объект пользовательского превью.').optional(),
	typingTime: z.number().describe('Время показа уведомления набора сообщения в чате собеседника.').optional(),
});

export class MessageDto extends createZodDto(MessageDtoScheme) {}
