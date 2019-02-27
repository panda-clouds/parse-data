
const PCData = require('../src/PCParseData.js');

describe('test PCData.pass', () => {
	it('should pass master only', () => {
		expect.assertions(2);

		const input = {};

		input.master = true;

		const result = PCData.pass(input);

		expect(result.useMasterKey).toBe(true);
		expect(result.sessionToken).toBeUndefined();
	});

	it('should pass user only', () => {
		expect.assertions(2);

		const input = {};
		const user = {};

		user.getSessionToken = () => {
			return 'r:mySuperSecretSessionToken';
		};
		input.user = user;

		const result = PCData.pass(input);

		expect(result.useMasterKey).toBeUndefined();
		expect(result.sessionToken).toBe('r:mySuperSecretSessionToken');
	});

	it('should pass nothing', () => {
		expect.assertions(2);

		const input = {};

		const result = PCData.pass(input);

		expect(result.useMasterKey).toBeUndefined();
		expect(result.sessionToken).toBeUndefined();
	});

	it('should pass both', () => {
		expect.assertions(2);

		const input = {};
		const user = {};

		user.getSessionToken = () => {
			return 'r:mySuperSecretSessionToken';
		};
		input.user = user;
		input.master = true;

		const result = PCData.pass(input);

		expect(result.useMasterKey).toBe(true);
		expect(result.sessionToken).toBe('r:mySuperSecretSessionToken');
	});
});
