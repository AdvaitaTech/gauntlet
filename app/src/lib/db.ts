import { Client, Pool } from 'pg';

const pool = new Pool({
	database: import.meta.env.DBNAME,
	user: import.meta.env.DBUSER,
	password: import.meta.env.DBPASSWORD,
	host: import.meta.env.DBHOST,
	port: import.meta.env.DBPORT,
	max: import.meta.env.DBPOOLMAX
});

export const getConnection = async () => await pool.connect();
