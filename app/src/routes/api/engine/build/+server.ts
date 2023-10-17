import { error, type RequestHandler } from '@sveltejs/kit';
import path from 'node:path';
import esbuild from 'esbuild';
import { z } from 'zod';

export const GET: RequestHandler = () => {
	return new Response('pong');
};

const resolveEnvironmentsPlugin: esbuild.Plugin = {
	name: 'resolve-env',
	setup(build) {
		console.log('plugin on');
		build.onResolve({ filter: new RegExp('.*') }, (args) => {
			console.log('got all args', args);
			return {};
		});
	}
};

export const POST: RequestHandler = async ({ request }) => {
	console.log('got post req', import.meta.url);
	const schema = z.object({
		content: z.string(),
		language: z.enum(['typescript', 'javascript']),
		environment: z.enum(['react'])
	});
	const json = await request.json();
	const result = schema.safeParse(json);
	if (!result.success) {
		console.log('validation fail', result.error.issues);
		throw error(400, {
			message: 'Validation failed',
			data: result.error.issues
		});
	}

	const js = await esbuild.build({
		stdin: {
			contents: result.data.content,
			resolveDir: '../environments/react/',
			sourcefile: 'main.js',
			loader: 'jsx'
		},
		bundle: false,
		minify: true,
		jsx: 'transform',
		write: false
	});

	if (js.outputFiles && js.outputFiles[0]) {
		const str = Buffer.from(js.outputFiles[0].contents).toString();
		console.log('got buffer contents', str);
		const index = `<html>
      <body>
        <div id="root"></div>
        <script type="importmap">
          {
            "imports": {
              "react": "https://esm.sh/react@18.2.0",
              "react-dom": "https://esm.sh/react@18.2.0",
              "react/jsx-runtime": "https://esm.sh/jsx-runtime@1.2.0"
            }
          }
        </script>
        <script type="module">${str}</script>
      </body>
    </html>`;
		return new Response(index);
	} else
		throw error(500, {
			message: 'Error while building',
			data: js
		});

	// if (js.outputFiles && js.outputFiles[0]) {
	// 	const str = Buffer.from(js.outputFiles[0].contents).toString();
	// 	const index = `<html><body><div id="root"></div></body><script type="text/javascript">${str}</script></html>`;
	// 	console.log('build complete', index);
	// 	// return new Response(js.outputFiles[0].contents);
	// 	return new Response(index);
	// } else
	// 	throw error(500, {
	// 		message: 'Error while building',
	// 		data: js
	// 	});
};
