import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '../../shared/config/config.service';
import { RestClientService } from '../../shared/rest-client/rest-client.service';
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
});
