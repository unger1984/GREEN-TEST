import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { Controller, Get, UseGuards, UsePipes } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { ApiAuth } from '../../shared/decorators/api-auth.decorator';
import { ApiAuthGuard } from '../../shared/decorators/api-auth.guard';
import { AuthDto } from '../../shared/dto/auth.dto';
import { SettingsDto } from './dto/settings.dto';
import { StateInstanceDto } from './dto/state-instance.dto';
import { SettingsService } from './settings.service';

@ApiTags('Настройки')
@Controller('settings')
@ApiHeader({
	name: 'X-API-AUTH',
	description: 'Base64(JSON({ instance, token }))',
	required: true,
})
@UseGuards(ApiAuthGuard)
@UsePipes(ZodValidationPipe)
export class SettingsController {
	constructor(private readonly settingsService: SettingsService) {}

	@Get('/')
	@ApiOperation({
		summary: 'Настройки аккаунта',
		description: 'Метод предназначен для получения текущих настроек аккаунта.',
	})
	@ApiResponse({ status: 200, description: 'Success', type: () => SettingsDto })
	@ApiUnauthorizedResponse({ description: 'Unauthorized' })
	async settings(@ApiAuth() auth: AuthDto) {
		return await this.settingsService.getGetSettings(auth.instance, auth.token);
	}

	@Get('/instance')
	@ApiOperation({
		summary: 'Состояние аккаунта',
		description: 'Метод предназначен для получения состояния аккаунта.',
	})
	@ApiResponse({ status: 200, description: 'Success', type: () => StateInstanceDto })
	@ApiUnauthorizedResponse({ description: 'Unauthorized' })
	async instance(@ApiAuth() auth: AuthDto) {
		return await this.settingsService.getStateInstance(auth.instance, auth.token);
	}
}
