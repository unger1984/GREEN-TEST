import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '../../shared/config/config.service';
import { RestClientService } from '../../shared/rest-client/rest-client.service';
import { MessageFileDto } from './dto/message-file-url.dto';
import { MessageResponseDto } from './dto/message-response.dto';
import { MessageDto } from './dto/message.dto';
import { MessageService } from './message.service';

describe('MessageService', () => {
	let service: MessageService;
	let restClientService: jest.Mocked<RestClientService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MessageService,
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

		service = module.get<MessageService>(MessageService);
		restClientService = module.get(RestClientService) as jest.Mocked<RestClientService>;
	});

	it('должен быть определен', () => {
		expect(service).toBeDefined();
	});

	describe('sendMessage', () => {
		it('должен формировать правильный URL для отправки сообщения', async () => {
			// Arrange
			const instance = '123456';
			const token = 'test-token';
			const message: MessageDto = {
				chatId: '79001234567@c.us',
				message: 'Тестовое сообщение',
			};
			const mockResponse: MessageResponseDto = {
				idMessage: 'message-id',
			};

			restClientService.post.mockResolvedValue(mockResponse);

			// Act
			await service.sendMessage(instance, token, message);

			// Assert
			expect(restClientService.post).toHaveBeenCalledWith(
				'https://test.api.com/waInstance123456/sendMessage/test-token',
				message,
			);
		});

		it('должен возвращать распаршенный MessageResponseDto', async () => {
			// Arrange
			const instance = '123456';
			const token = 'test-token';
			const message: MessageDto = {
				chatId: '79001234567@c.us',
				message: 'Тестовое сообщение',
			};
			const mockResponse = {
				idMessage: 'message-id',
			};

			restClientService.post.mockResolvedValue(mockResponse);

			// Act
			const result = await service.sendMessage(instance, token, message);

			// Assert
			expect(result).toEqual({
				idMessage: 'message-id',
			});
		});
	});

	describe('sendFileByUrl', () => {
		it('должен формировать правильный URL для отправки файла по ссылке', async () => {
			// Arrange
			const instance = '123456';
			const token = 'test-token';
			const file: MessageFileDto = {
				chatId: '79001234567@c.us',
				urlFile: 'https://example.com/file.pdf',
				fileName: 'test.pdf',
			};
			const mockResponse: MessageResponseDto = {
				idMessage: 'file-message-id',
			};

			restClientService.post.mockResolvedValue(mockResponse);

			// Act
			await service.sendFileByUrl(instance, token, file);

			// Assert
			expect(restClientService.post).toHaveBeenCalledWith(
				'https://test.api.com/waInstance123456/sendFileByUrl/test-token',
				file,
			);
		});

		it('должен возвращать распаршенный MessageResponseDto', async () => {
			// Arrange
			const instance = '123456';
			const token = 'test-token';
			const file: MessageFileDto = {
				chatId: '79001234567@c.us',
				urlFile: 'https://example.com/file.pdf',
				fileName: 'test.pdf',
			};
			const mockResponse = {
				idMessage: 'file-message-id',
			};

			restClientService.post.mockResolvedValue(mockResponse);

			// Act
			const result = await service.sendFileByUrl(instance, token, file);

			// Assert
			expect(result).toEqual({
				idMessage: 'file-message-id',
			});
		});
	});
});
