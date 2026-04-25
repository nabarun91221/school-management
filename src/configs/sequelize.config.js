import { Sequelize } from "sequelize";

import "dotenv/config.js"

const DBNAME = process.env.DB_NAME
const DBUSER = process.env.DB_USER
const DBPASSWORD = process.env.DB_PASSWORD
const DBHOST = process.env.DB_HOST
const DBDIALECT = process.env.DB_DIALECT

export const sequelize = new Sequelize(DBNAME, DBUSER, DBPASSWORD, {
    host: DBHOST,
    dialect: DBDIALECT,
    logging: false
});

export const connectDB = async () =>
{
    try {
        await sequelize.authenticate();
        console.log("MySql connected Successfully");

        await sequelize.sync();
    } catch (error) {
        console.error("DB Error:", error);
    }
};