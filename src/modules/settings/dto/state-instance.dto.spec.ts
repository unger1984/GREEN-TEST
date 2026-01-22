import { StateInstanceDto, StateInstanceDtoScheme, StateInstanceType } from './state-instance.dto';

describe('StateInstanceDto', () => {
	it('должен быть определен', () => {
		expect(StateInstanceDto).toBeDefined();
		expect(StateInstanceDtoScheme).toBeDefined();
	});

	it('должен корректно валидировать допустимые значения stateInstance', () => {
		const validData = {
			stateInstance: StateInstanceType.authorized,
		};

		expect(() => StateInstanceDtoScheme.parse(validData)).not.toThrow();
	});

	it('должен отклонять недопустимые значения stateInstance', () => {
		const invalidData = {
			stateInstance: 'invalid-state',
		};

		expect(() => StateInstanceDtoScheme.parse(invalidData)).toThrow();
	});
});
