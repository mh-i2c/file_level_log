const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, errors } = format;
const path = require("path");
require("winston-daily-rotate-file");

// Used for pass unique id for every request
var makeID = (function() {
    var index = 0;
    return function() {
     return index++;
    }
  })();

// customized information message
const myFormat = printf(({ timestamp, level, message }) => {
    const {id, request, type, queryparameters, response, status, header, url } =
    message;
    if (level === "info" && message !== undefined) {
        return `logtime : ${timestamp} id:${id} url : ${url} type : ${type} queryparameters : ${
      queryparameters ? JSON.stringify(queryparameters) : ""
    } headers : ${JSON.stringify(header)} body: ${
      request ? JSON.stringify(request) : JSON.stringify(response)
    } responsecode : ${status ? status : ""}  `;
    }
});
const date=new Date();
const manageLog = (filepath) => {
    return createLogger({
        transports: [           
            // Store infomation related logs in information file
            new transports.DailyRotateFile({
                filename: path.join(filepath, `info_%DATE%_${date.getHours()}${date.getMinutes()}${date.getSeconds()}_${Math.floor(100000 + Math.random() * 900000)}.log`),
                datePattern:`YYYYMMDD`,
                maxSize:"5m",
                level: "info",
                format: combine(
                    timestamp({
                        format: "YYYY-MM-DD HH:mm:ss",
                    }),
                    myFormat,
                    errors({ stack: false })
                ),
            }),
        ],
        handleExceptions: true,
    });
};

exports = module.exports = function fileLogs(filepath) {
    const logs = manageLog(filepath);
    
    return function fileLogs(req, res, next) {
        try {          
            req.id=makeID();          
            if (req) {
                logs.info({
                    id:req.id,
                    request: req.body,
                    queryparameters: req.params ? req.params : req.query ? req.query : "",
                    header: req.headers,
                    url: req.path,
                    status: req.statusCode ? req.statusCode : "",
                    type: "request",
                });
            }
            var end = res.end;
            res.end = function(chunk, encoding) {
                res.responseTime = new Date() - req._startTime;

                res.end = end;
                res.end(chunk, encoding);

                if (chunk) {
                    const body = isJson(chunk.toString()) ?
                        JSON.parse(chunk.toString()) :
                        chunk.toString();
                    logs.info({
                        id:req.id,
                        request: body,
                        queryparameters: req.params ?
                            req.params :
                            req.query ?
                            req.query :
                            "",
                        header: res.getHeaders(),
                        url: req.path,
                        status: res.statusCode,
                        type: "response",
                    });
                }
            };

            next();
        } catch (error) {
            logs.error(error);
        }
    };
};

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}