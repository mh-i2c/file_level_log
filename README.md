File level log in to system

## Installing

Using npm:

```bash
$ npm install file_level_logger
```

Using bower:

```bash
$ bower install file_level_logger
```

Using yarn:

```bash
$ yarn add file_level_logger
```

## Way of Use

### note: CommonJS usage

In order to gain the CommonJS imports with `require()` use the following approach:

```js
const express = require("express");
const server =express(); 
const port =3000 // Entered you port
const fileLog = require("file_level_logger");

//Folder path where you want to store files
const filePath =path.join(__dirname,"./logs")

server.use(fileLog(filepath))
server.listen(port, () => console.log(`listening on port ${port}!`));

```

