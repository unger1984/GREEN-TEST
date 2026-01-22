export class StringHelper {
	static generatePassowrd(length: number): string {
		const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		let retVal = '';
		for (let index = 0, nchar = charset.length; index < length; ++index) {
			retVal += charset.charAt(Math.floor(Math.random() * nchar));
		}
		return retVal;
	}

	/**
	 * Преобразует простой текст в html
	 * @param text
	 * @returns {*}
	 */
	static wrapText(text: string): string {
		if (!text) {
			return text;
		}
		let res = text.replace(/\n/g, '<br />');
		res = res.replace(/\s\s/g, '&nbsp;');
		return res;
	}

	static rusToLatin(str: string): string {
		const ru = new Map([
			['а', 'a'],
			['б', 'b'],
			['в', 'v'],
			['г', 'g'],
			['д', 'd'],
			['е', 'e'],
			['є', 'e'],
			['ё', 'e'],
			['ж', 'j'],
			['з', 'z'],
			['и', 'i'],
			['ї', 'yi'],
			['й', 'i'],
			['к', 'k'],
			['л', 'l'],
			['м', 'm'],
			['н', 'n'],
			['о', 'o'],
			['п', 'p'],
			['р', 'r'],
			['с', 's'],
			['т', 't'],
			['у', 'u'],
			['ф', 'f'],
			['х', 'h'],
			['ц', 'c'],
			['ч', 'ch'],
			['ш', 'sh'],
			['щ', 'shch'],
			['ы', 'y'],
			['э', 'e'],
			['ю', 'u'],
			['я', 'ya'],
		]);

		str = str
			.replaceAll(/[ъь%:]+/gi, '')
			.replaceAll('&', '_')
			.replaceAll('+', '_')
			.replaceAll('*', '_')
			.replaceAll('#', '_')
			.replaceAll('%', '_')
			.replaceAll('$', '_')
			.replaceAll('@', '_')
			.replaceAll('!', '_')
			.replaceAll('?', '_')
			.replaceAll(';', '_')
			.replaceAll(',', '_')
			.replaceAll('^', '_')
			.replaceAll('/', '_')
			.replaceAll('\\', '_')
			.replaceAll(/\s/g, '_');

		return Array.from(str).reduce(
			(st, lt) =>
				st +
				(ru.get(lt) ||
					(ru.get(lt.toLowerCase()) === undefined && lt) ||
					ru.get(lt.toLowerCase())?.toUpperCase() ||
					''),
			'',
		);
	}

	public static toBcryptBase64(buffer: Buffer): string {
		return buffer.toString('base64').replace(/\+/g, '.').replace(/\//g, '/').slice(0, 22);
	}

	public static makeSaltFromString(str: string, rounds = 10): string {
		const buf = Buffer.alloc(16);
		buf.write(str); // лишнее обрежется автоматически

		const saltBody = StringHelper.toBcryptBase64(buf);

		return `$2b$${rounds.toString().padStart(2, '0')}$${saltBody}`;
	}
}
