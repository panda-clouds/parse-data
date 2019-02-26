
const PCParseRunner = require('../src/PCParseRunner.js');
const Parse = require('parse/node');

function runAllTests(version, cloud) {
	describe('check beforesave in v' + version, () => {
		const parseRunner = new PCParseRunner();

		parseRunner.parseVersion(version);
		parseRunner.cloud(cloud);
		parseRunner.loadFile('./src/PCTestClass.js', 'PCTestClass.js');

		beforeAll(async () => {
			await parseRunner.startParseServer();
		}, 1000 * 60 * 2);

		afterAll(async () => {
			await parseRunner.cleanUp();
		});

		it('should return everest', async () => {
			expect.assertions(2);
			const result = await Parse.Cloud.run('challenge');

			expect(result).toBe('everest');
			expect(result).not.toBe('superman');
		});

		it('should read from dynamic class', async () => {
			expect.assertions(2);
			const result = await Parse.Cloud.run('useDynamicClass');

			expect(result).toBe('everest');
			expect(result).not.toBe('superman');
		});

		it('passes when allowed by beforeSave', async () => {
			expect.assertions(2);
			const obj = new Parse.Object('PassClass');

			obj.set('mykey', 'value');
			const result = await obj.save();

			expect(result).toBeDefined();
			expect(result.className).toBe('PassClass');
		});

		it('fails when blocked by beforeSave', async () => {
			expect.assertions(2);
			const obj = new Parse.Object('FailClass');

			obj.set('mykey', 'value');

			try {
				await obj.save();
			} catch (error) {
				expect(error).toBeDefined();
				expect(error.message).toBe('Saves to this class always fail');
			}
		});

		it('dropDB should remove data', async () => {
			expect.assertions(5);
			const obj = new Parse.Object('PassClass');

			obj.set('mykey', 'value');
			const savedObj = await obj.save();

			expect(savedObj).toBeDefined();
			expect(savedObj.className).toBe('PassClass');

			const query = new Parse.Query('PassClass');
			const result = await query.first();

			expect(result).toBeDefined();
			expect(result.get('mykey')).toBe('value');

			await parseRunner.dropDB();

			const query2 = new Parse.Query('PassClass');
			const result2 = await query2.find();

			expect(result2).toHaveLength(0);
		}, 20 * 1000);
	});
}


const cloudV2 =
`
Parse.Cloud.define('challenge', function(request, response) {
  response.success('everest');
});
Parse.Cloud.define('useDynamicClass', function(request, response) {
	const MyClass = require(__dirname + '/PCTestClass.js');
	response.success(MyClass.challenge());
});
Parse.Cloud.beforeSave('FailClass',(request,response)=>{
	response.error('Saves to this class always fail');
})
Parse.Cloud.beforeSave('PassClass',(request,response)=>{
	response.success('Saves to this class always fail');
})`;

runAllTests('2.8.4', cloudV2);

const cloudV3 =
`
Parse.Cloud.define('challenge', function(request, response) {
	return 'everest';
});
Parse.Cloud.define('useDynamicClass', async request => {

	const MyClass = require(__dirname + '/PCTestClass.js');
	return await MyClass.challenge()
});
Parse.Cloud.beforeSave('FailClass', request => {
	throw new Error('Saves to this class always fail');
})
Parse.Cloud.beforeSave('PassClass', request => {
	// passes by default
})`;

runAllTests('3.1.3', cloudV3);
