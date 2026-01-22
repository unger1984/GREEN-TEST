import { Injectable } from '@nestjs/common';

import { ConfigService } from '../../shared/config/config.service';
import { RestClientService } from '../../shared/rest-client/rest-client.service';
import { SettingsDto, SettingsDtoScheme } from './dto/settings.dto';
import { StateInstanceDto, StateInstanceDtoScheme } from './dto/state-instance.dto';

@Injectable()
export class SettingsService {
	constructor(
		private readonly configService: ConfigService,
		private readonly restClient: RestClientService,
	) {}

	public async getStateInstance(instance: string, token: string): Promise<StateInstanceDto> {
		const res = await this.restClient.get<StateInstanceDto>(
			`${this.configService.green.url}/waInstance${instance}/getStateInstance/${token}`,
		);
		return StateInstanceDtoScheme.parse(res);
	}

	public async getGetSettings(instance: string, token: string): Promise<SettingsDto> {
		const res = await this.restClient.get<SettingsDto>(
			`${this.configService.green.url}/waInstance${instance}/getSettings/${token}`,
		);
		return SettingsDtoScheme.parse(res);
	}
}
