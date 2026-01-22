import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '../../shared/config/config.service';
import { YesNo } from '../../shared/dto/yesno';
import { RestClientService } from '../../shared/rest-client/rest-client.service';
import { SettingsDto } from './dto/settings.dto';
import { StateInstanceDto, StateInstanceType } from './dto/state-instance.dto';
import { SettingsService } from './settings.service';

describe('SettingsService', () => {
	let service: SettingsService;
	let restClientService: jest.Mocked<RestClientService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SettingsService,
				{
					provide: ConfigService,
					useValue: {
						green: {
							url: 'https://test.api.com',
						},
					},
				},
				{
					provide: RestClientService,
					useValue: {
						get: jest.fn(),
						post: jest.fn(),
						put: jest.fn(),
						delete: jest.fn(),
					},
				},
			],
		}).compile();

		service = module.get<SettingsService>(SettingsService);
		restClientService = module.get(RestClientService) as jest.Mocked<RestClientService>;
	});

	it('должен быть определен', () => {
		expect(service).toBeDefined();
	});

	describe('getStateInstance', () => {
		it('должен формировать правильный URL для запроса состояния инстанса', async () => {
			// Arrange
			const instance = '123456';
			const token = 'test-token';
			const mockResponse: StateInstanceDto = {
				stateInstance: StateInstanceType.authorized,
			};

			restClientService.get.mockResolvedValue(mockResponse);

			// Act
			await service.getStateInstance(instance, token);

			// Assert
			expect(restClientService.get).toHaveBeenCalledWith(
				`https://test.api.com/waInstance${instance}/getStateInstance/${token}`,
			);
		});

		it('должен возвращать распаршенный StateInstanceDto', async () => {
			// Arrange
			const instance = '123456';
			const token = 'test-token';
			const mockResponse = {
				stateInstance: 'authorized',
			};

			restClientService.get.mockResolvedValue(mockResponse);

			// Act
			const result = await service.getStateInstance(instance, token);

			// Assert
			expect(result).toEqual({
				stateInstance: StateInstanceType.authorized,
			});
		});
	});

	describe('getGetSettings', () => {
		it('должен формировать правильный URL для запроса настроек', async () => {
			// Arrange
			const instance = '123456';
			const token = 'test-token';
			const mockResponse: SettingsDto = {
				wid: '1234567890@c.us',
				countryInstance: 'RU',
				typeAccount: 'whatsapp',
				webhookUrl: 'https://webhook.url',
				webhookUrlToken: 'webhook-token',
				delaySendMessagesMilliseconds: 1000,
				markIncomingMessagesReaded: YesNo.yes,
				markIncomingMessagesReadedOnReply: YesNo.no,
				sharedSession: 'shared-session',
				proxyInstance: 'proxy-instance',
				outgoingWebhook: YesNo.yes,
				outgoingMessageWebhook: YesNo.no,
				outgoingAPIMessageWebhook: YesNo.yes,
				incomingWebhook: YesNo.yes,
				deviceWebhook: YesNo.no,
				statusInstanceWebhook: 'status-webhook',
				stateWebhook: YesNo.yes,
				enableMessagesHistory: 'enable-history',
				keepOnlineStatus: 'online',
				pollMessageWebhook: YesNo.no,
				incomingBlockWebhook: YesNo.yes,
				incomingCallWebhook: YesNo.no,
				editedMessageWebhook: YesNo.yes,
				deletedMessageWebhook: YesNo.no,
			};

			restClientService.get.mockResolvedValue(mockResponse);

			// Act
			await service.getGetSettings(instance, token);

			// Assert
			expect(restClientService.get).toHaveBeenCalledWith(
				`https://test.api.com/waInstance${instance}/getSettings/${token}`,
			);
		});

		it('должен возвращать распаршенный SettingsDto', async () => {
			// Arrange
			const instance = '123456';
			const token = 'test-token';
			const mockResponse = {
				wid: '1234567890@c.us',
				countryInstance: 'RU',
				typeAccount: 'whatsapp',
				webhookUrl: 'https://webhook.url',
				webhookUrlToken: 'webhook-token',
				delaySendMessagesMilliseconds: 1000,
				markIncomingMessagesReaded: YesNo.yes,
				markIncomingMessagesReadedOnReply: YesNo.no,
				sharedSession: 'shared-session',
				proxyInstance: 'proxy-instance',
				outgoingWebhook: YesNo.yes,
				outgoingMessageWebhook: YesNo.no,
				outgoingAPIMessageWebhook: YesNo.yes,
				incomingWebhook: YesNo.yes,
				deviceWebhook: YesNo.no,
				statusInstanceWebhook: 'status-webhook',
				stateWebhook: YesNo.yes,
				enableMessagesHistory: 'enable-history',
				keepOnlineStatus: 'online',
				pollMessageWebhook: YesNo.no,
				incomingBlockWebhook: YesNo.yes,
				incomingCallWebhook: YesNo.no,
				editedMessageWebhook: YesNo.yes,
				deletedMessageWebhook: YesNo.no,
			};

			restClientService.get.mockResolvedValue(mockResponse);

			// Act
			const result = await service.getGetSettings(instance, token);

			// Assert
			expect(result).toEqual(mockResponse);
		});
	});
});
