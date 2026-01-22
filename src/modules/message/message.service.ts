import { Injectable } from '@nestjs/common';

import { ConfigService } from '../../shared/config/config.service';
import { RestClientService } from '../../shared/rest-client/rest-client.service';
import { MessageResponseDto, MessageResponseDtoScheme } from './dto/message-response.dto';
import { MessageDto } from './dto/message.dto';

@Injectable()
export class MessageService {
	constructor(
		private readonly configService: ConfigService,
		private readonly restClient: RestClientService,
	) {}

	public async sendMessage(instance: string, token: string, message: MessageDto): Promise<MessageResponseDto> {
		const res = await this.restClient.post<MessageResponseDto>(
			`${this.configService.green.url}/waInstance${instance}/sendMessage/${token}`,
			message,
		);
		return MessageResponseDtoScheme.parse(res);
	}
}
