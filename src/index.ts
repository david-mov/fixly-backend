import { Hono } from 'hono';
import { createError } from './utils';

const api = new Hono<{ Bindings: Env }>();

api.get('/reviews', async (ctx) => {
	try {
		const query = 'SELECT author, comment, rating, post_date FROM reviews';
		const {results} = await ctx.env.DB.prepare(query)
			.all()
		return ctx.json(results);
	} catch (err) {
		console.error(err);
		return ctx.json({ error: (err instanceof Error ? err.message : true) }, 500);
	}
  })

api.post('/reviews', async (ctx) => {
	try {
	    const { author, comment, rating } = await ctx.req.json();
		const query = 'INSERT INTO reviews (author, comment, rating, post_date) VALUES (?, ?, ?, ?) RETURNING *'
		const postDate = (new Date()).toLocaleDateString();
		const newReview = await ctx.env.DB.prepare(query)
			.bind(author, comment, rating, postDate)
			.first<ReviewRow>();
		return ctx.json(newReview);
	} catch (err) {
		console.error(err);
		return ctx.json({ error: (err instanceof Error ? err.message : true) }, 500);
	}
  });

const app = new Hono();

app.route('/api', api);

app.notFound((ctx) => {
	return createError(ctx, 404, 'Not found');
  });
  
app.onError((err, ctx) => {
	console.error(`${err}`);
	return createError(ctx, 500);
});

export default app;
