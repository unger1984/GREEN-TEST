import { AuthDto, AuthDtoScheme } from './auth.dto';

describe('AuthDto', () => {
	it('должен быть определен', () => {
		expect(AuthDto).toBeDefined();
		expect(AuthDtoScheme).toBeDefined();
	});

	it('должен корректно валидировать правильные данные', () => {
		const validData = {
			instance: '123456',
			token: 'test-token',
		};

		expect(() => AuthDtoScheme.parse(validData)).not.toThrow();
	});

	it('должен отклонять данные без instance', () => {
		const invalidData = {
			token: 'test-token',
		};

		expect(() => AuthDtoScheme.parse(invalidData)).toThrow();
	});

	it('должен отклонять данные без token', () => {
		const invalidData = {
			instance: '123456',
		};

		expect(() => AuthDtoScheme.parse(invalidData)).toThrow();
	});
});
