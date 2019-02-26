
PCBash
=========
maintained by [PandaClouds.com](https://pandaclouds.com)

`PCBash` is a lightweight JavaScript library for Node.js that provides additional Bash methods.


Installation
------------

1. If you want to use this library, you first need to install the [Node.js](https://nodejs.org/en/).

2. When you install node.js, will also be installed [npm](https://www.npmjs.com/).

3. Please run the following command.

```
npm install --save @panda-clouds/parse-bash
```

Usage
-----

### Node.js

```javascript
const PCBash = require('@panda-clouds/parse-bash');

// example usage
PCBash.runCommandPromise('pwd')
	.then((result)=>{
		console.log(result) // => "/path/to/my/dir";
	});

PCBash.putStringInFile('Hello World!',"/tmp/hello-world")
	.then((result)=>{
		PCBash.runCommandPromise('cat "/tmp/hello-world"')
			.then((result)=>{
				console.log(result) // => "Hello World!";
			});
	}); 
```

You can replace PCBash with any variable.


Methods
-------

[Unit Tests] are an additional resource for learning functionality.

### - runCommandPromise(string)

Returns a promise that is resolved with the contents of stdout.

Example:

```javascript
PCBash.runCommandPromise('pwd')
	.then((result)=>{
		console.log(result) // => "/path/to/my/dir";
	});
```

### - putStringInFile(string)

places the contents of the string into the file path provided


Example:

```javascript
PCBash.putStringInFile('Hello World!',"/tmp/hello-world")
	.then((result)=>{
		PCBash.runCommandPromise('cat "/tmp/hello-world"')
			.then((result)=>{
				console.log(result) // => "Hello World!";
			});
	}); 
```

Contributions
-------------

Pull requests are welcome! here is a checklist to speed things up:

- modify `PCBash.js`
- add unit tests in `PCBash.spec.js`
- run `npm test`
- document method in `README.md`
- add your name to 'Contributors' in `README.md`


### Contributors

(Add your name)

- [*] [Marc Smith](https://github.com/mrmarcsmith)


[Unit Tests]: https://github.com/panda-clouds/string/blob/master/spec/PCBash.spec.js
