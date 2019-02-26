/* global Promise */
const fs = require('fs');

fs.readFileAsync = filename => {
	return new Promise((resolve, reject) => {
		fs.readFile(filename, (err, buffer) => {
			if (err) {
				reject(err);
			} else {
				resolve(buffer.toString());
			}
		});
	});
};

const PCBash = require('@panda-clouds/parse-bash');
const Parse = require('parse/node');
const exampleAppId = 'example-app-id';
const exampleJavascriptKey = 'example-javascript-key';
const exampleMasterKey = 'example-master-key';

class PCParseRunner {
	constructor() {
		const now = new Date();

		this.seed = now.getTime();
		this.parseVersionValue = '3.1.3';
	}

	parseVersion(version) {
		this.parseVersionValue = version;
	}
	loadFile(path, name) {
		this.requireFilePath = path;
		this.requireFileName = name;
	}

	cloud(cloudPage) {
		this.cloudPage = cloudPage;
	}

	static defaultDBName() {
		return 'parse-test';
	}

	static tempDir() {
		// This failed because we use Jenkins in docker.
		// the 'write' would go into the jenkins container
		// and the 'read' would go to the host through the docker.sock
		// also we couldn't match the jenkins volume (which would work)
		// because the new one kept saying 'invalid username/password'

		// A: https://github.com/jenkinsci/docker/issues/174
		// basically, you can't just move the dir
		// // we have a 'temp' directory in the root of this projects
		// var path = __dirname;

		// // Notice the double-backslashes on this following line
		// path = path.replace(/ /g, '\\ ');

		// // eslint-disable-next-line no-console
		// console.log('tempDir: ' + path)
		// return path;
		return '/tmp/testing';
	}

	async startParseServer() {
		process.env.TESTING = true;

		if (process.env.SPEC_USE_EXTERNAL_SERVER) {
			Parse.initialize(exampleAppId, exampleJavascriptKey, exampleMasterKey);
			Parse.serverURL = 'http://localhost:1337/1';

			return;
		}

		const OSType = await PCBash.runCommandPromise('uname -s');

		if (OSType === 'Darwin') {
			// this hack is requried when using Docker for mac
			this.hostURL = 'host.docker.internal';
			this.net = '';
		} else if (OSType === 'Linux') {
			this.hostURL = 'localhost';
			this.net = '--net host';
		}

		await PCBash.runCommandPromise('mkdir -p ' + PCParseRunner.tempDir());

		const makeMongo = 'docker run --rm -d ' + this.net + ' ' +
				'--name mongo-' + this.seed + ' ' +
				'-p 27017:27017 ' +
				'mongo ' +
				'';

		await PCBash.runCommandPromise(makeMongo);

		const config = {};

		config.allowInsecureHTTP = true;
		const app = {};

		app.appId = exampleAppId;
		app.masterKey = exampleMasterKey;
		app.javascriptKey = exampleJavascriptKey;
		app.port = 1337;
		app.mountPath = '/1';
		// app.databaseName = PCParseRunner.defaultDBName();
		// derived data
		// mac hack
		app.databaseURI = 'mongodb://' + this.hostURL + ':27017/' + PCParseRunner.defaultDBName();
		app.publicServerURL = 'http://localhost:' + app.port + app.mountPath;
		app.serverURL = app.publicServerURL;
		app.cloud = '/parse-server/cloud/main-' + this.seed + '.js';
		config.apps = [app];

		await PCBash.putStringInFile(config, PCParseRunner.tempDir() + '/config-' + this.seed);

		await PCBash.runCommandPromise('pwd');

		if (this.requireFilePath) {
			const result = await fs.readFileAsync(this.requireFilePath);

			await PCBash.putStringInFile(result, PCParseRunner.tempDir() + '/' + this.requireFileName);
		}

		await PCBash.putStringInFile(this.cloudPage, PCParseRunner.tempDir() + '/main-' + this.seed + '.js');


		await PCBash.runCommandPromise('docker run --rm -d ' + this.net + ' ' +
		'--name parse-' + this.seed + ' ' +
		'-v ' + PCParseRunner.tempDir() + '/config-' + this.seed + ':/parse-server/configuration.json ' +
		'-v ' + PCParseRunner.tempDir() + ':/parse-server/cloud/ ' +
		'-p 1337:1337 ' +
		'parseplatform/parse-server:' + this.parseVersionValue + ' ' +
		'/parse-server/configuration.json');

		await PCBash.runCommandPromise(
			'until $(curl --output /dev/null --silent --head --fail http://localhost:1337/1/health); do\n' +
		'    printf \'Waiting for Parse Server to come up...\n\'\n' +
		'    sleep 1\n' +
		'done'
		);

		await PCBash.runCommandPromise(
			'until $(curl --output /dev/null --silent --fail http://localhost:27017); do\n' +
		'    printf \'Waiting for Mongo to come up...\n\'\n' +
		'    sleep 1\n' +
		'done'
		);

		Parse.initialize(exampleAppId, exampleJavascriptKey, exampleMasterKey);
		Parse.serverURL = 'http://localhost:1337/1';
		// eslint-disable-next-line no-console
		console.log('Parse Server up and running');
	}

	async dropDB() {
		await PCBash.runCommandPromise('docker exec mongo-' + this.seed + ' mongo ' + PCParseRunner.defaultDBName() + ' --eval "db.dropDatabase()"');
	}

	async cleanUp() {
		process.env.TESTING = true;

		if (process.env.SPEC_USE_EXTERNAL_SERVER) {
			// no clean up
			return;
		}

		try {
			await this.dropDB();
		} catch (e) {
			// Disregard failures
		}

		try {
			await PCBash.runCommandPromise('docker logs parse-' + this.seed);
		} catch (e) {
			// Disregard failures
		}

		try {
			await PCBash.runCommandPromise('rm ' + PCParseRunner.tempDir() + '/main-' + this.seed + '.js');
		} catch (e) {
			// Disregard failures
		}

		try {
			await PCBash.runCommandPromise('rm ' + PCParseRunner.tempDir() + '/config-' + this.seed);
		} catch (e) {
			// Disregard failures
		}

		try {
			if (this.requireFileName) {
				await PCBash.runCommandPromise('rm ' + PCParseRunner.tempDir() + '/' + this.requireFileName);
			}
		} catch (e) {
			// Disregard failures
		}

		try {
			await PCBash.runCommandPromise('docker stop parse-' + this.seed);
		} catch (e) {
			// Disregard failures
		}

		try {
			await PCBash.runCommandPromise('docker stop mongo-' + this.seed);
		} catch (e) {
			// Disregard failures
		}
	}
}

module.exports = PCParseRunner;
