const config = {
    port: 3002,

    //database setting
    jwt: {
        secret: 'marco',
        encode: 'HS512',
    },
    database: {
        DATABASE: 'date_ball',
        USERNAME: 'root',
        PASSWORD: 'rooter',
        PORT: 3306,
        HOST: 'localhost'
    },
    password: {
        saltTimes: 10
    },
    log: {
        appenders: {
            out: {
                type: 'console'
            },
            user: {
                type: 'dateFile',
                filename: 'logs/user',
                pattern: "-yyyy-MM-dd.log",
                alwaysIncludePattern: true
            },
            common: {
                type: 'file',
                filename: 'logs/common.log',
                maxLogSize: 20480,
                backups: 3
            },
            error: {
                type: "logLevelFilter",
                level: "ERROR",
                appender: {
                    type: "file",
                    filename: "logs/errors.log"
                }
            },
            warn: {
                type: "logLevelFilter",
                level: "WARN",
                appender: {
                    type: "file",
                    filename: "logs/warn.log"
                }
            }
        },
        categories: {
            default: { appenders: ['user', 'common'], level: 'debug' }
        }
    }
}

module.exports = config