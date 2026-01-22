export class ConfigServer {
	constructor(
		public readonly host: string,
		public readonly port: number,
		public readonly url: string,
		public readonly staticPath: string,
	) {}
}
