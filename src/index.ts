/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env, ctx): Promise<Response> {
			const query = 'INSERT INTO reviews (author, comment, rating, post_date) VALUES (?, ?, ?, ?) RETURNING *'
			const postDate = (new Date()).toLocaleDateString();
			const newReview = await env.MY_DB.prepare(query)
				.bind('David', 'Good job', 4, postDate)
				.first<ReviewRow>();
			return new Response(JSON.stringify(newReview));

	},
} satisfies ExportedHandler<Env>;
