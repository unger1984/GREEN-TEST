import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { Test, TestingModule } from '@nestjs/testing';

import { ApiAuthGuard } from '../../shared/decorators/api-auth.guard';
import { AuthDto } from '../../shared/dto/auth.dto';
import { MessageFileDto } from './dto/message-file-url.dto';
import { MessageResponseDto } from './dto/message-response.dto';
import { MessageDto } from './dto/message.dto';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

describe('MessageController', () => {
	let controller: MessageController;
	let service: jest.Mocked<MessageService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [MessageController],
			providers: [
				{
					provide: MessageService,
					useValue: {
						sendMessage: jest.fn(),
						sendFileByUrl: jest.fn(),
					},
				},
			],
		})
			.overrideGuard(ApiAuthGuard)
			.useValue({ canActivate: jest.fn(() => true) })
			.overridePipe(ZodValidationPipe)
			.useValue({ transform: jest.fn(value => value) })
			.compile();

		controller = module.get<MessageController>(MessageController);
		service = module.get(MessageService) as jest.Mocked<MessageService>;
	});

	it('должен быть определен', () => {
		expect(controller).toBeDefined();
	});

	describe('sendMessage', () => {
		it('должен вызывать метод sendMessage сервиса с правильными параметрами', async () => {
			// Arrange
			const auth: AuthDto = {
				instance: '123456',
				token: 'test-token',
			};
			const message: MessageDto = {
				chatId: '79001234567@c.us',
				message: 'Тестовое сообщение',
			};
			const mockResponse: MessageResponseDto = {
				idMessage: 'message-id',
			};

			service.sendMessage.mockResolvedValue(mockResponse);

			// Act
			const result = await controller.sendMessage(auth, message);

			// Assert
			expect(service.sendMessage).toHaveBeenCalledWith('123456', 'test-token', message);
			expect(result).toEqual(mockResponse);
		});
	});

	describe('sendFileByUrl', () => {
		it('должен вызывать метод sendFileByUrl сервиса с правильными параметрами', async () => {
			// Arrange
			const auth: AuthDto = {
				instance: '123456',
				token: 'test-token',
			};
			const file: MessageFileDto = {
				chatId: '79001234567@c.us',
				urlFile: 'https://example.com/file.pdf',
				fileName: 'test.pdf',
			};
			const mockResponse: MessageResponseDto = {
				idMessage: 'file-message-id',
			};

			service.sendFileByUrl.mockResolvedValue(mockResponse);

			// Act
			const result = await controller.sendFileByUrl(auth, file);

			// Assert
			expect(service.sendFileByUrl).toHaveBeenCalledWith('123456', 'test-token', file);
			expect(result).toEqual(mockResponse);
		});
	});
});
