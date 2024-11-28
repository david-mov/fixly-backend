// test/index.spec.ts
import { env, createExecutionContext, waitOnExecutionContext } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src/index';

// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;
const BASE_URL = 'http://127.0.0.1:8787';

describe('GET /reviews', () => {
	it('responds with an array', async () => {
		const request = new IncomingRequest(BASE_URL + '/api/reviews');
		// Create an empty context to pass to `worker.fetch()`.
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		// Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
		await waitOnExecutionContext(ctx);
		expect(await response.json()).toBeInstanceOf(Array);
	});
});

describe('POST /reviews', () => {
	it('responds with the added review data', async () => {
		const reviewInput = {
			author: 'Tester',
			comment: 'Good work man!',
			rating: 4
		};

		const request = new IncomingRequest(BASE_URL + '/api/reviews', {
			method: 'POST',
			body: JSON.stringify(reviewInput)
		});

		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);

		await waitOnExecutionContext(ctx);
		expect(await response.json()).toMatchObject(reviewInput);
	});
});

describe('Not defined route', () => {
	it('responds with status 404', async () => {
		const request = new IncomingRequest(BASE_URL + '/thisCouldBeAnyUndefinedURL');

		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);

		await waitOnExecutionContext(ctx);
		expect(await response.status).toBe(404);
	})

	it('responds with a error object', async () => {
		const request = new IncomingRequest(BASE_URL + '/thisCouldBeAnyUndefinedURL');

		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);

		await waitOnExecutionContext(ctx);
		expect(await response.json()).toEqual({status: 404, statusText: 'Not found'});
	})
})