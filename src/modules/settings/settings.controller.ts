import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthDto } from '../../shared/dto/auth.dto';
import { StateInstanceDto } from './dto/state-instance.dto';
import { SettingsService } from './settings.service';

@ApiTags('Настройки')
@Controller('settings')
@UsePipes(ZodValidationPipe)
export class SettingsController {
	constructor(private readonly settingsService: SettingsService) {}

	@Post('/instance')
	@ApiOperation({
		summary: 'Состояние аккаунта',
		description: 'Метод предназначен для получения состояния аккаунта.',
	})
	@ApiBody({ type: () => AuthDto, required: true, description: 'Авторизационные данные' })
	@ApiResponse({ status: 200, description: 'Success', type: () => StateInstanceDto })
	async instance(@Body() auth: AuthDto) {
		await this.settingsService.getStateInstance(auth.instance, auth.token);
	}
}
