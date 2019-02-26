Panda Clouds ESLint Config
=========
maintained by [PandaClouds.com](https://pandaclouds.com)

An ESLint config for standardizing Panda Clouds Projects.

Installation
------------

1. If you want to use this library, you first need to install the [Node.js](https://nodejs.org/en/).

2. When you install node.js, will also be installed [npm](https://www.npmjs.com/).

3. Please run the following command.

```
npm install --save-dev @panda-clouds/eslint-config-panda-clouds
```

4. run the following command:

```
cat << 'EOF' > .eslintrc.js
module.exports = {
    extends: '@panda-clouds/eslint-config-panda-clouds',
    rules: {},
};
EOF
```
