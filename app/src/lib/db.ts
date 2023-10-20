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
		fieldPrefix?: string;
		queryPrefix?: string;
		paramOffset?: number;
		joinString?: string;
	}
) => {
	let params: T[keyof T][] = [];
	const prefix = options && options.fieldPrefix ? `${options.fieldPrefix + '.'}` : '';
	const queryPrefix = options && options.queryPrefix ? options.queryPrefix : 'WHERE';
	const offset = options && options.paramOffset !== undefined ? options.paramOffset : 0;
	const joinString = options && options.joinString ? options.joinString : ' AND ';
	const query = Object.entries<T[keyof T]>(filters)
		.filter(([key, value]) => value !== undefined)
		.map(([key, value], index) => {
			params.push(value);
			return `${prefix + key}=$${index + 1 + offset}`;
		})
		.join(joinString);
	if (query !== '') return [`${queryPrefix} ${query}`, params] as const;
	else return [query, params] as const;
};
