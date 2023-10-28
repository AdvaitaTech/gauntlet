import jwt from 'jsonwebtoken';
import { AppError, AuthError, BadDataError, ValidationError } from '$lib/error';
import { authenticateUser, createUser } from '$lib/server/models/users';
import { redirect, type Actions } from '@sveltejs/kit';
import { z } from 'zod';

export const actions = {
	default: async ({ request, locals, cookies }) => {
		try {
			const loginSchema = z.object({
				email: z.string(),
				password: z.string()
			});
			const data = await request.formData();
			const email = data.get('email');
			const password = data.get('password');

			console.log('getting parse token');
			const parsed = loginSchema.safeParse({ email, password });
			if (!parsed.success) {
				console.error('Error during register: Unable to parse:', parsed.error);
				throw new ValidationError('Improper auth data');
			}
			const user = await authenticateUser(locals.db, {
				email: parsed.data.email,
				password: parsed.data.password
			});
			if (!user) throw new AuthError('Incorrect password');
			const token = jwt.sign(user.id.toString(), process.env.SECRET || '');
			console.log('setting token');
			cookies.set('token', token, {
				path: '/',
				httpOnly: true,
				// sameSite: 'strict',
				secure: process.env.PROD ? true : false,
				maxAge: 60 * 60 * 24 * 30
			});
		} catch (e) {
			console.log('catching login error', e);
			if (e instanceof BadDataError) {
				throw redirect(303, '/login?error=BadDataError');
			} else if (e instanceof AuthError) {
				throw redirect(303, '/login?error=AuthError');
			} else if (e instanceof AppError) {
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
