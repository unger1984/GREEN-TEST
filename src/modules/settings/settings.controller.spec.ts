import { Test, TestingModule } from '@nestjs/testing';

import { AuthDto } from '../../shared/dto/auth.dto';
import { YesNo } from '../../shared/dto/yesno';
import { SettingsDto } from './dto/settings.dto';
import { StateInstanceDto, StateInstanceType } from './dto/state-instance.dto';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';

describe('SettingsController', () => {
	let controller: SettingsController;
	let settingsService: jest.Mocked<SettingsService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [SettingsController],
			providers: [
				{
					provide: SettingsService,
					useValue: {
						getStateInstance: jest.fn(),
						getGetSettings: jest.fn(),
					},
				},
			],
		}).compile();

		controller = module.get<SettingsController>(SettingsController);
		settingsService = module.get(SettingsService) as jest.Mocked<SettingsService>;
	});

	it('должен быть определен', () => {
		expect(controller).toBeDefined();
	});

	describe('instance', () => {
		it('должен вызывать метод getStateInstance сервиса с правильными параметрами', async () => {
			// Arrange
			const authDto: AuthDto = {
				instance: '123456',
				token: 'test-token',
			};

			const mockResult: StateInstanceDto = {
				stateInstance: StateInstanceType.authorized,
			};

			settingsService.getStateInstance.mockResolvedValue(mockResult);

			// Act
			await controller.instance(authDto);

			// Assert
			expect(settingsService.getStateInstance).toHaveBeenCalledWith(authDto.instance, authDto.token);
		});
	});

	describe('settings', () => {
		it('должен вызывать метод getGetSettings сервиса с правильными параметрами', async () => {
			// Arrange
			const authDto: AuthDto = {
				instance: '123456',
				token: 'test-token',
			};

			const mockResult: SettingsDto = {
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

			settingsService.getGetSettings.mockResolvedValue(mockResult);

			// Act
			await controller.settings(authDto);

			// Assert
			expect(settingsService.getGetSettings).toHaveBeenCalledWith(authDto.instance, authDto.token);
		});
	});
});
