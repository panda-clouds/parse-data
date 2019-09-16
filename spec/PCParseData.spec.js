
const PCParseRunner = require('@panda-clouds/parse-runner');
const Parse = require('parse/node');
const myProp = 'myProp';
const mustNotChangeError = 'The property ' + myProp + ' must not change';
const mustExistError = 'The property ' + myProp + ' must exist';

function coreTests(coreObject, differentObject) {
	describe('mustExist', () => {
		it('should pass when it exists', async () => {
			expect.assertions(1);
			const obj = new Parse.Object('MustExist');

			obj.set(myProp, coreObject);
			const result = await obj.save();

			expect(result.id).toHaveLength(10);
		});

		it('should fail when it doesnt exist', async () => {
			expect.assertions(2);
			const obj = new Parse.Object('MustExist');

			obj.set('asdf', 'cnuos');

			try {
				await obj.save();

				expect(1).toBe(2);
			} catch (error) {
				expect(error.message).toBeDefined();
				expect(error.message).toBe(mustExistError);
			}
		});
	});

	describe('mustNotChange', () => {
		it('should pass when it doesnt change', async () => {
			expect.assertions(2);
			const obj = new Parse.Object('MustNotChange');

			obj.set(myProp, coreObject);

			const result1 = await obj.save();

			expect(result1.id).toHaveLength(10);

			obj.set('asdf', 'jkl;');

			const result2 = await obj.save();

			expect(result2.get('asdf')).toBe('jkl;');
		});

		it('should fail when it changes', async () => {
			expect.assertions(3);
			const obj = new Parse.Object('MustNotChange');

			obj.set(myProp, coreObject);

			try {
				const result1 = await obj.save();

				expect(result1.id).toHaveLength(10);

				result1.set(myProp, differentObject);

				await result1.save();

				expect(1).toBe(2);
			} catch (error) {
				expect(error.message).toBeDefined();
				expect(error.message).toBe(mustNotChangeError);
			}
		});

		it('should pass when it is reset with original value', async () => {
			expect.assertions(2);
			const obj = new Parse.Object('MustNotChange');

			obj.set(myProp, coreObject);

			const result1 = await obj.save();

			expect(result1.id).toHaveLength(10);
			result1.set(myProp, coreObject);

			const result2 = await result1.save();

			expect(result2.id).toHaveLength(10);
		});

		it('should pass when set after initial save', async () => {
			expect.assertions(2);
			const obj = new Parse.Object('MustNotChange');

			obj.set('asdf', 'jkl;');

			const result1 = await obj.save();

			expect(result1.id).toHaveLength(10);

			obj.set(myProp, coreObject);

			const result2 = await obj.save();

			expect(result2.id).toHaveLength(10);
		});
	});

	describe('mustExist Chained to MustNotChange', () => {
		it('should pass when it exists', async () => {
			expect.assertions(1);
			const obj = new Parse.Object('MustExistAndMustNotChange');

			obj.set(myProp, coreObject);
			const result = await obj.save();

			expect(result.id).toHaveLength(10);
		});

		it('should fail when it doesnt exist', async () => {
			expect.assertions(2);
			const obj = new Parse.Object('MustExistAndMustNotChange');

			obj.set('asdf', 'cnuos');

			try {
				await obj.save();

				expect(1).toBe(2);
			} catch (error) {
				expect(error.message).toBeDefined();
				expect(error.message).toBe(mustExistError);
			}
		});

		it('should pass when it doesnt change', async () => {
			expect.assertions(2);
			const obj = new Parse.Object('MustExistAndMustNotChange');

			obj.set(myProp, coreObject);

			const result1 = await obj.save();

			expect(result1.id).toHaveLength(10);

			obj.set('asdf', 'jkl;');

			const result2 = await obj.save();

			expect(result2.get('asdf')).toBe('jkl;');
		});

		it('should fail when it changes', async () => {
			expect.assertions(3);
			const obj = new Parse.Object('MustExistAndMustNotChange');

			obj.set(myProp, coreObject);

			try {
				const result1 = await obj.save();

				expect(result1.id).toHaveLength(10);

				result1.set(myProp, differentObject);

				await result1.save();

				expect(1).toBe(2);
			} catch (error) {
				expect(error.message).toBeDefined();
				expect(error.message).toBe(mustNotChangeError);
			}
		});

		it('should pass when it is reset with original value', async () => {
			expect.assertions(2);
			const obj = new Parse.Object('MustExistAndMustNotChange');

			obj.set(myProp, coreObject);

			const result1 = await obj.save();

			expect(result1.id).toHaveLength(10);
			result1.set(myProp, coreObject);

			const result2 = await result1.save();

			expect(result2.id).toHaveLength(10);
		});
	});

	fdescribe('mustBeBefore', () => {
		it('should fail if start is not a date', async () => {
			expect.assertions(3);

			// no end set.
			let obj = new Parse.Object('MustBeBefore');

			obj.set('start', 12);

			await expect(obj.save()).rejects.toThrow('The property start must be a date');

			// end is set to a date.
			obj = new Parse.Object('MustBeBefore');

			obj.set('start', 12);
			obj.set('end', new Date());

			await expect(obj.save()).rejects.toThrow('The property start must be a date');

			// end is set to a not date.
			obj.set('start', 12);
			obj.set('end', 12);

			await expect(obj.save()).rejects.toThrow('The property start must be a date');
		});

		it('should fail if end is a date', async () => {
			expect.assertions(1);

			const obj = new Parse.Object('MustBeBefore');

			obj.set('start', new Date());
			obj.set('end', 12);

			await expect(obj.save()).rejects.toThrow('The property end must be a date');
		});

		it('should fail if start is after end', async () => {
			expect.assertions(1);

			const obj = new Parse.Object('MustBeBefore');

			obj.set('start', new Date('2019-09-16T00:00:00'));
			obj.set('end', new Date('2019-09-15T00:00:00'));

			await expect(obj.save()).rejects.toThrow('The property start must be before property end');
		});

		it('should fail if start is the same as end', async () => {
			expect.assertions(1);

			const obj = new Parse.Object('MustBeBefore');

			obj.set('start', new Date('2019-09-16T00:00:00'));
			obj.set('end', new Date('2019-09-15T00:00:00'));

			await expect(obj.save()).rejects.toThrow('The property start must be before property end');
		});

		it('should pass if start is before end', async () => {
			expect.assertions(1);

			const obj = new Parse.Object('MustBeBefore');

			obj.set('start', new Date('2019-09-16T00:00:00'));
			obj.set('end', new Date('2019-09-17T00:00:00'));

			const result = await obj.save();

			console.log(JSON.stringify(result, null, 2));

			expect(result).toBeDefined();
		});
	});
}
function allTests(version, cloud) {
	describe('parse Server v' + version, () => {
		const parseRunner = new PCParseRunner();

		parseRunner.parseVersion(version);
		parseRunner.cloud(cloud);
		parseRunner.loadFile('./src/PCParseData.js', 'PCParseData.js');


		beforeAll(async () => {
			await parseRunner.startParseServer();
		}, 1000 * 60 * 2);

		afterAll(async () => {
			await parseRunner.cleanUp();
		});

		beforeEach(async () => {
			await parseRunner.dropDB();
		}, 1000 * 60 * 2);

		describe('server status', () => {
			it('should run cloud function (challenge/everest)', async () => {
				expect.assertions(2);
				const result = await Parse.Cloud.run('challenge');

				expect(result).toBe('everest');
				expect(result).not.toBe('superman');
			});
		});
		describe('string', () => {
			coreTests('core', 'different');
		});
		describe('date', () => {
			coreTests(new Date(), new Date(123456789));
		});
	});
}


const cloudV3 =
`
Parse.Cloud.define('challenge', function(request, response) {
	return 'everest';
});
console.log('ncousodcslidbs 1')
const PCData = require(__dirname + '/PCParseData.js');

Parse.Cloud.beforeSave('AlwaysFail', request =>{
	throw new Error('AAAAHHHHH')
})

Parse.Cloud.beforeSave('MustExist', request =>{
	const data = new PCData(request);
	data.prop('myProp').mustExist();
});

Parse.Cloud.beforeSave('MustNotChange', request =>{
	const data = new PCData(request);
	data.prop('myProp').mustNotChange();
});

// test chaining
Parse.Cloud.beforeSave('MustExistAndMustNotChange',(request,response)=>{
	const data = new PCData(request);
	data.prop('myProp').mustExist().mustNotChange();
});

Parse.Cloud.beforeSave('MustBeBefore', request => {
	const data = new PCData(request);
	data.prop('start').mustBeBefore('end');
});
`;

allTests('3.1.3', cloudV3);

const cloudV2 =
`
Parse.Cloud.define('challenge', (request, response) => {
	response.success('everest');
});
const PCData = require(__dirname + '/PCParseData.js');
Parse.Cloud.beforeSave('AlwaysFail',(request,response)=>{
	response.error('BOOM');
})

// mustExist
Parse.Cloud.beforeSave('MustExistAndMustNotChange',(request,response)=>{

	const data = new PCData(request);

	try{
		console.log('ncousodcslidbs 4')
		// These functions will 'throw new Error('Property 'parent' must exist');'
		data.prop('myProp').mustExist().mustNotChange()

	}catch(e){
		console.log('in beforeSave failure: ' + e)
		response.error(e.message);
		return;
	}
	response.success('success');
})
Parse.Cloud.beforeSave('MustExist',(request,response)=>{

	const data = new PCData(request);

	try{
		console.log('ncousodcslidbs 4')
		// These functions will 'throw new Error('Property 'parent' must exist');'
		data.prop('myProp').mustExist()

	}catch(e){
		console.log('in beforeSave failure: ' + e)
		response.error(e.message);
		return;
	}
	response.success('success');
})

// mustNotChange
Parse.Cloud.beforeSave('MustNotChange', (request, response) => {

	console.log('ncousodcslidbs 2')
	const data = new PCData(request);
	console.log('ncousodcslidbs 3')

	try{
		console.log('ncousodcslidbs 4')
		// These functions will 'throw new Error('Property 'parent' must exist');'
		data.prop('myProp').mustNotChange()

	}catch(e){
		console.log('in beforeSave failure: ' + e)
		response.error(e.message);
		return;
	}
	response.success('success');

});
`;

allTests('2.8.4', cloudV2);

