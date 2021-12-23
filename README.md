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
const fileLog = require("file_level_logger");
const log = fileLog.manageLog(__dirname); //Folder path where you want to store files
```

Performing a `Info` log

```js
const fileLog = require("file_level_logger");
const log = fileLog.manageLog(__dirname); //Folder path where you want to store files
// All information related log store into info file
// Make a request  with an object to store info
log.info({
  request: "request",
  type: "request",
  queryparameters: "queryparameters",
  header: "header",
  url: "url",
  response: "response",
});
// In object you must be pass type,url and one of this (request,response)

// Make a request  with an object to store info
// All errors are store under error.log file inside your given folder path
log.error({
  error: "message an error.",
});
```

# Example

```js
// Have to first install packege by npm
// After installtion
 $ mkdir logs

const fileLog = require("file_level_logger");
const path=require("path")
const log = fileLog.manageLog(path.join(__dirname,"./logs")); //Folder path where you want to store files

// For information log use
log.info({
  request: "request",
  type: "request",
  queryparameters: "queryparameters",
  header: "header",
  url: "url",
  response: "response",
})

// For Error related logs
log.error({
  error: "message an error.",
});

```
