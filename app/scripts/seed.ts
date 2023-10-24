import { setup } from '../tests/test.setup';

const main = async () => {
	await setup();
};

console.log('running seed');
main()
	.then(() => {
		console.log('seed successful');
	})
	.catch((e) => {
		console.log('caught error during seed');
	});
