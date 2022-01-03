const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, errors } = format;
const path = require("path");

// customized information message
const myFormat = printf(({ timestamp, level, message }) => {
    const { request, type, queryparameters, response, status, header, url } =
    message;
    if (level === "info" && message !== undefined) {
        return `logtime : ${timestamp} url : ${url} type : ${type} queryparameters : ${
      queryparameters ? JSON.stringify(queryparameters) : ""
    } headers : ${JSON.stringify(header)} body: ${
      request ? JSON.stringify(request) : JSON.stringify(response)
    } responsecode : ${status ? status : ""}  `;
    }
});

const manageLog = (filepath) => {
    return createLogger({
        transports: [           
            // Store infomation related logs in information file
            new transports.File({
                filename: path.join(filepath, "information.log"),
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
            if (req) {
                logs.info({
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