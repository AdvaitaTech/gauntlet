import jwt from 'jsonwebtoken';
import { AppError, AuthError, BadDataError, ValidationError } from '$lib/error';
import { authenticateUser, createUser } from '$lib/models/users';
import { redirect, type Actions } from '@sveltejs/kit';
import { z } from 'zod';

export const actions = {
	default: async ({ request, locals, cookies }) => {
		try {
			const registerSchema = z.object({
				email: z.string(),
				password: z.string(),
				confirm: z.string(),
				name: z.string().nullable().optional()
			});
			const data = await request.formData();
			const email = data.get('email');
			const password = data.get('password');
			const confirm = data.get('confirm');
			const name = data.get('name') || undefined;

			if (password !== confirm)
				throw new ValidationError('password and confirmation values don"t match');
			const parsed = registerSchema.safeParse({ email, password, confirm, name });
			if (!parsed.success) {
				console.error('Error during register: Unable to parse:', parsed.error);
				throw new ValidationError('Improper auth data');
			}
			console.log('before create', parsed.data);
			const user = await createUser(locals.db, {
				email: parsed.data.email,
				password: parsed.data.password,
				name: parsed.data.name || undefined
			});
			if (!user) throw new BadDataError('Failed to create user');
			const token = jwt.sign(user.id.toString(), process.env.SECRET || '');
			cookies.set('token', token, {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: process.env.PROD ? true : false,
				maxAge: 60 * 60 * 24 * 30
			});
			console.log('done', user);
		} catch (e) {
			//@ts-ignore
			console.log('caught', e, e.name, e.message, e.type);
			if (e instanceof BadDataError) throw redirect(303, '/register?error=BadDataError');
			else if (e instanceof ValidationError) throw redirect(303, '/register?error=ValidationError');
			else if (e instanceof AppError) {
				return new Response(e.message, {
					status: e.code,
					statusText: e.name
				});
			} else
				return new Response('Internal Server Error', {
					status: 500,
					statusText: 'Internal Server Error'
				});
		}
		throw redirect(303, '/explore');
	}
} satisfies Actions;
