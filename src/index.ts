import { Hono } from 'hono';

const api = new Hono<{ Bindings: Env }>();
api
  .get('/reviews', async (ctx) => {
	try {
		const query = 'SELECT author, comment, rating, post_date FROM reviews';
		const {results} = await ctx.env.MY_DB.prepare(query)
			.all()
		return ctx.json(results);
	} catch (err) {
		console.error(err);
		return ctx.json({ error: (err instanceof Error ? err.message : true) }, 500);
	}
  })
  .post('/reviews', async (ctx) => {
	try {
	    const { author, comment, rating } = await ctx.req.json();
		const query = 'INSERT INTO reviews (author, comment, rating, post_date) VALUES (?, ?, ?, ?) RETURNING *'
		const postDate = (new Date()).toLocaleDateString();
		const newReview = await ctx.env.MY_DB.prepare(query)
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

export default app;
