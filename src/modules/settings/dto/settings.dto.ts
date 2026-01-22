import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

import { YesNo } from '../../../shared/dto/yesno';

export const SettingsDtoScheme = z.object({
	wid: z.string().describe('Идентификатор аккаунта в WhatsApp'),
	countryInstance: z.string().describe('Не используется'),
	typeAccount: z.string().describe('Не используется'),
	webhookUrl: z.string().describe('Адрес отправки уведомлений (URL)'),
	webhookUrlToken: z.string().describe('Заголовок авторизации для отправки уведомлений'),
	delaySendMessagesMilliseconds: z.number().describe('Интервал отправки сообщений'),
	markIncomingMessagesReaded: z.nativeEnum(YesNo).describe('Отмечать входящие сообщения прочитанными'),
	markIncomingMessagesReadedOnReply: z
		.nativeEnum(YesNo)
		.describe('Отмечать входящие сообщения прочитанными при отправке сообщения через API'),
	sharedSession: z.string().describe('Не используется'),
	proxyInstance: z.string().describe('В документации не описано'),
	outgoingWebhook: z.nativeEnum(YesNo).describe('Получать уведомления о статусах отправленных сообщений'),
	outgoingMessageWebhook: z
		.nativeEnum(YesNo)
		.describe('Получать уведомления о сообщениях, отправленных с телефона, web версии и desktop версии'),
	outgoingAPIMessageWebhook: z
		.nativeEnum(YesNo)
		.describe('Получать уведомления о сообщениях, отправленных через API'),
	incomingWebhook: z.nativeEnum(YesNo).describe('Получать уведомления о входящих сообщениях и файлах'),
	deviceWebhook: z
		.nativeEnum(YesNo)
		.describe('Получать уведомления об устройстве (телефоне) и уровне заряда батареи'),
	statusInstanceWebhook: z.string().describe('Не используется'),
	stateWebhook: z.nativeEnum(YesNo).describe('Получать уведомления об изменении состояния авторизации инстанса'),
	enableMessagesHistory: z.string().describe('Не используется'),
	keepOnlineStatus: z.string().describe("Выставляет статус 'В сети'"),
	pollMessageWebhook: z.nativeEnum(YesNo).describe('Получать уведомления об опросах'),
	incomingBlockWebhook: z.nativeEnum(YesNo).describe('Получать уведомления о входящих блокировках чатов'),
	incomingCallWebhook: z.nativeEnum(YesNo).describe('Получать уведомления о входящих звонках'),
	editedMessageWebhook: z.nativeEnum(YesNo).describe('Получать уведомления об отредактированных сообщениях'),
	deletedMessageWebhook: z.nativeEnum(YesNo).describe('Получать уведомления об удалённых сообщениях'),
});

export class SettingsDto extends createZodDto(SettingsDtoScheme) {}
