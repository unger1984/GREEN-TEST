import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export enum StateInstanceType {
	notAuthorized = 'notAuthorized',
	authorized = 'authorized',
	blocked = 'blocked',
	sleepMode = 'sleepMode',
	starting = 'starting',
	yellowCard = 'yellowCard',
}

export const StateInstanceDtoScheme = z.object({
	stateInstance: z.nativeEnum(StateInstanceType).describe('Состояние'),
});

export class StateInstanceDto extends createZodDto(StateInstanceDtoScheme) {}
