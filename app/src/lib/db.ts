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

export const getParameterizedQuery = <T extends {}>(
	filters: T,
	options?: {
		prefix: string;
	}
) => {
	let params: T[keyof T][] = [];
	const prefix = options && options.prefix ? `${options.prefix + '.'}` : '';
	const query = Object.entries<T[keyof T]>(filters)
		.filter(([key, value]) => value !== undefined)
		.map(([key, value], index) => {
			params.push(value);
			return `${prefix + key}=$${index + 1}`;
		})
		.join(' AND ');
	if (query !== '') return [`WHERE ${query}`, params] as const;
	else return [query, params] as const;
};
