import { ConfigurableModuleBuilder } from '@nestjs/common';

import { Config } from './config';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } = new ConfigurableModuleBuilder<Config>()
	.setExtras(
		{
			isGlobal: true,
		},
		(definition, extras) => ({
			...definition,
			global: extras.isGlobal,
		}),
	)
	.setFactoryMethodName('createConfigOptions')
	.build();
