
PCData
=========
maintained by [PandaClouds.com](https://pandaclouds.com)

`PCData` provides a clean way to validate data in Parse Sever Cloud Code.


Installation
------------

1. If you want to use this library, you first need to install the [Node.js](https://nodejs.org/en/).

2. When you install node.js, will also be installed [npm](https://www.npmjs.com/).

3. Please run the following command.

```
npm install --save @panda-clouds/parse-data
```

Usage
-----

### Node.js

```javascript
const PCData = require('@panda-clouds/parse-data');

// example usage
Parse.Cloud.beforeSave('Book', request =>{
	const data = new PCData(request);

	// will throw Error if request.object.get('title') doesn't exist
	data.prop('title').mustExist();

	// Chain requirements together
	data.prop('author').mustExist().mustNotChange();
});
```

You can replace PCData with any variable.


Methods
-------

[Unit Tests] are an additional resource for learning functionality.

### - mustExist()

requires the property to be set,
else throws error

Example:

```javascript
Parse.Cloud.beforeSave('Book', request =>{
	const data = new PCData(request);
	data.prop('title').mustExist();    // will throw Error if request.object.get('title') doesn't exist
});
```

### - mustNotChange()

requires the property to be the same as the first time ACUTUALLY SETTING IT,
else throws error

Note: undefined => value will NOT throw an error
Consider the following
1. the object is saved WITHOUT setting the property.
2. the object is saved again WITH setting the property.
3. this will pass

Example:

```javascript
Parse.Cloud.beforeSave('Book', request =>{
	const data = new PCData(request);
	data.prop('title').mustNotChange();    // will throw Error if request.object.get('title') is not equal to request.original.get('title')
});
```

### - mustBeBefore(propName)

Requires that the property be before the property specified by propName.

Example:

```javascript
Parse.Cloud.beforeSave('TimePeriod', request => {
	const data = new PCData(request);

	data.prop('start').mustBeBefore('end');	// will throw Error if start or end are not Date objects or if start is not before end.
});
````


Contributions
-------------

Pull requests are welcome! here is a checklist to speed things up:

- modify `PCData.js`
- add unit tests in `PCData.spec.js`
- run `npm test`
- document method in `README.md`
- add your name to 'Contributors' in `README.md`


### Contributors

(Add your name)

- [*] [Marc Smith](https://github.com/mrmarcsmith)
- [*] [Scott Runyon](https://github.com/east-empire)


[Unit Tests]: https://github.com/panda-clouds/string/blob/master/spec/PCData.spec.js
