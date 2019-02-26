
PCParseJasmine
=========
maintained by [PandaClouds.com](https://pandaclouds.com)

`PCParseJasmine` is a lightweight JavaScript library for Node.js that provides additional String methods.


Installation
------------

1. If you want to use this library, you first need to install the [Node.js](https://nodejs.org/en/).

2. When you install node.js, will also be installed [npm](https://www.npmjs.com/).

3. Please run the following command.

```
npm install --save @panda-clouds/parse-jasmine
```

Usage
-----

### Node.js

```javascript
const PCParseJasmine = require('@panda-clouds/parse-jasmine');

// example usage
PCParseJasmine.isString('yup!'); // => true;
PCParseJasmine.hasWhitespace('ABC'); // => false;
```

You can replace PCParseJasmine with any variable.


Methods
-------

[Unit Tests] are an additional resource for learning functionality.

### - isString(string)

Returns whether a given object is a String.

Example:

```javascript
PCParseJasmine.isString('ABC') // => true
PCParseJasmine.isString(5) // => false
PCParseJasmine.isString({}) // => false
PCParseJasmine.isString([]) // => false
```

### - hasWhiteSpace(string)

returns true if the string has white space, false if not.


Example:

```javascript
PCParseJasmine.hasWhitespace(' ') // => true
PCParseJasmine.hasWhitespace('A B') // => true
PCParseJasmine.hasWhitespace('AB') // => false
PCParseJasmine.hasWhitespace('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-!@#$%^&*()') // => false
```


### - removeWhitespace(string)

Removes all white characters from the given string.

Example:

```javascript
PCParseJasmine.removeWhitespace(' A B  C   D    ') // => 'ABCD'
PCParseJasmine.removeWhitespace('	A	B	C			D	') // => 'ABCD'
PCParseJasmine.removeWhitespace('\nA\nB\n\nC\n\n\nD\n\n\n\n') // => 'ABCD'
PCParseJasmine.removeWhitespace(null) // => ''
```

### - domainSafeString(string)

Removes all non-domain-safe characters.

Example:

```javascript
PCParseJasmine.domainSafeString('_A_B__C___D____') // => 'ABCD'
PCParseJasmine.domainSafeString('	A	B	C			D	') // => 'ABCD'
PCParseJasmine.domainSafeString('\nA\nB\n\nC\n\n\nD\n\n\n\n') // => 'ABCD'
PCParseJasmine.domainSafeString(null) // => ''
```


Contributions
-------------

Pull requests are welcome! here is a checklist to speed things up:

- modify `PCParseJasmine.js`
- add unit tests in `PCParseJasmine.spec.js`
- run `npm test`
- document method in `README.md`
- add your name to 'Contributors' in `README.md`


### Contributors

(Add your name)

- [*] [Marc Smith](https://github.com/mrmarcsmith)


[Unit Tests]: https://github.com/panda-clouds/string/blob/master/spec/PCParseJasmine.spec.js
