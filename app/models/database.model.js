const Sequelize = require('sequelize');

module.exports = function DBConnection() {

    const dbConfig = {
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        database: process.env.MYSQL_DATABASE,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        connectionLimit: 20,
        queueLimit: 30,
    };

    // console.log("dbConfig: ", dbConfig);

    const sequelize = new Sequelize(
        dbConfig.database,
        dbConfig.user,
        dbConfig.password,
        {
          dialect: "mysql",
          pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
          },
          host: dbConfig.host,
          port: dbConfig.port,
          queueLimit: dbConfig.queueLimit,
          connectionLimit: dbConfig.connectionLimit,
          socketPath: "/var/run/mysqld/mysqld.sock",
          // socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock",
          logging: false,
        }
      );
    
      return sequelize;
    
    
}