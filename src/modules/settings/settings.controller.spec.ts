import { Test, TestingModule } from '@nestjs/testing';

import { AuthDto } from '../../shared/dto/auth.dto';
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
});
