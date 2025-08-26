const mysql = require('mysql2');
const logger = require('./logger');

function createConnection() {
    return mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        connectTimeout: 10000,
        idleTimeout: 30000,
    });
}

let connection;

function handleDisconnect() {
    connection = createConnection();

    connection.connect((err) => {
        if (err) {
            logger.error(`Error connecting to DB: ${err}`);
            setTimeout(handleDisconnect, 2000); // Retry connection after 2 seconds
        } else {
            logger.info(`Connected to database: ${process.env.DB_NAME}`);
            startKeepAlive(connection); // Inicia o keep-alive
        }
    });

    connection.on('error', (err) => {
        if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
            logger.error(`DB connection error: ${err}. Reconnecting...`);
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

function startKeepAlive(connection) {
    setInterval(() => {
        connection.query('SELECT 1', (err) => {
            if (err) {
                logger.error(`Error with keep-alive query: ${err}`);
            } else {
                //logger.info('Keep-alive query executed successfully');
            }
        });
    }, 60000); // Envia a cada 1 minuto (ajuste conforme necessário)
}


handleDisconnect();

module.exports = {
    query: (sql, params) => {
        return new Promise((resolve, reject) => {
            connection.query(sql, params, (err, results) => {
                if (err) {
                    logger.error(`Query error: ${err}`);
                    if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
                        handleDisconnect();
                    }
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    },

    beginTransaction: () => {
        return new Promise((resolve, reject) => {
            connection.beginTransaction((err) => {
                if (err) {
                    logger.error(`Transaction error: ${err}`);
                    return reject(err);
                }
                resolve();
            });
        });
    },

    commit: () => {
        return new Promise((resolve, reject) => {
            connection.commit((err) => {
                if (err) {
                    logger.error(`Commit error: ${err}`);
                    return connection.rollback(() => {
                        reject(err);
                    });
                }
                resolve();
            });
        });
    },

    rollback: () => {
        return new Promise((resolve, reject) => {
            connection.rollback(() => {
                logger.info('Transaction rolled back');
                resolve();
            });
        });
    }
};
