import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Supabase connection details from environment variables
const dbHost = process.env.DB_HOST ;  // Supabase host
const dbPort = process.env.DB_PORT ;  // Custom PostgreSQL port from URI
const dbName = process.env.DB_NAME;  
const dbUser = process.env.DB_USER ;  // User from URI
const dbPassword = process.env.DB_PASSWORD ;  

// Ensure all necessary environment variables are set
if (!dbHost || !dbPort || !dbName || !dbUser || !dbPassword) {
    throw new Error('Missing required database connection details. Please check your .env file.');
}

// Sequelize connection setup
const sequelize = new Sequelize({
    dialect: 'postgres', // or 'mysql', 'sqlite', 'mariadb', 'mssql'
    host: dbHost,
    port: parseInt(dbPort),
    username: dbUser,
    password: dbPassword,
    database: dbName,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

// Export the Sequelize instance
export default sequelize;