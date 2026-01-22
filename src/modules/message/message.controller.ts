import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiHeader,
	ApiInternalServerErrorResponse,
	ApiOperation,
	ApiResponse,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ApiAuth } from '../../shared/decorators/api-auth.decorator';
import { ApiAuthGuard } from '../../shared/decorators/api-auth.guard';
import { AuthDto } from '../../shared/dto/auth.dto';
import { MessageResponseDto } from './dto/message-response.dto';
import { MessageDto } from './dto/message.dto';
import { MessageService } from './message.service';

@ApiTags('Сообщения')
@Controller('message')
@ApiHeader({
	name: 'X-API-AUTH',
	description: 'Base64(JSON({ instance, token }))',
	required: true,
})
@UseGuards(ApiAuthGuard)
@UsePipes(ZodValidationPipe)
export class MessageController {
	constructor(private readonly messageService: MessageService) {}

	@Post('/')
	@ApiOperation({
		summary: 'Отправить сообщение',
		description:
			'Метод предназначен для отправки текстового сообщения в личный или групповой чат. Сообщение будет добавлено в очередь на отправку. Сообщение на отправку хранится 24 часа в очереди и будет отправлено сразу же после авторизации телефона. Скорость отправки сообщений из очереди регулирует параметр Интервал отправки сообщений.',
	})
	@ApiBody({ type: () => MessageDto, required: true, description: 'Сообщение' })
	@ApiResponse({ status: 200, description: 'Success', type: () => MessageResponseDto })
	@ApiUnauthorizedResponse({ description: 'Unauthorized' })
	@ApiBadRequestResponse({ description: 'Bad Request' })
	@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
	async sendMessage(@ApiAuth() auth: AuthDto, @Body() message: MessageDto) {
		return await this.messageService.sendMessage(auth.instance, auth.token, message);
	}
}
