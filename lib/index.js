const { createLogger, format, transports, level } = require("winston");
const { combine, timestamp, printf, errors } = format;
const path = require("path");

// customized information message
const myFormat = printf(({ timestamp, level, message }) => {
    const { request, type, queryparameters, response, status, header, url } =
    message;
    if (level === "info") {
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
            // Store error and other logs in error file
            new transports.File({
                level: "error",
                filename: path.join(filepath, "error.log"),
                format: combine(
                    timestamp({
                        format: "YYYY-MM-DD HH:mm:ss",
                    }),
                    format.timestamp(),
                    format.json(),
                    errors({ stack: true })
                ),
            }),
            // Store infomation related logs in information file
            new transports.File({
                filename: path.join(filepath, "info.log"),
                level: "info",
                format: combine(
                    timestamp({
                        format: "YYYY-MM-DD HH:mm:ss",
                    }),
                    myFormat,
                    errors({ stack: true })
                ),
            }),
        ],
    });
};
/**
 * Used for log errors and data into log files which inside your given folder
 * @return nothing, just check your given folder
 * @accept type of an object like { request, type, queryparameters, response, status, header, url } into message for information
 * @param  {Object} val that's take  an object and store logs into logs folder
 */

exports.manageLog = manageLog;