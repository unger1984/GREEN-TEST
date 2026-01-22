import { ConfigGreen } from './config-green';
import { ConfigServer } from './config-server';

export abstract class Config {
	public abstract get env(): string;
	public abstract get server(): ConfigServer;
	public abstract get green(): ConfigGreen;
}
