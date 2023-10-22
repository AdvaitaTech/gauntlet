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
				name: z.string().nullable()
			});
			const data = await request.formData();
			const email = data.get('email');
			const password = data.get('password');
			const confirm = data.get('confirm');
			const name = data.get('name') || undefined;

			if (password !== confirm) throw new AuthError('password and confirmation values don"t match');
			const parsed = registerSchema.safeParse({ email, password, confirm, name });
			if (!parsed.success) {
				console.error('Error during register: Unable to parse:', parsed.error);
				throw new ValidationError('Improper auth data');
			}
			const user = await createUser(locals.db, {
				email: parsed.data.email,
				password: parsed.data.password
			});
			if (!user) throw new BadDataError('Failed to create user');
			const token = jwt.sign(user.id.toString(), process.env.SECRET || '', {
				expiresIn: 60 * 60 * 24 * 30
			});
			cookies.set('token', token, {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: process.env.PROD ? true : false,
				maxAge: 60 * 60 * 24 * 30
			});
			return redirect(303, '/explore');
		} catch (e) {
			if (e instanceof AppError) {
				return new Response(e.message, {
					status: e.code,
					statusText: e.name
				});
			}
		}
	}
} satisfies Actions;
