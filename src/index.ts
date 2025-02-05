import 'dotenv/config';
import { Hono } from 'hono';
import { createError } from './utils';
import {cors} from 'hono/cors';
import {logger} from 'hono/logger';
import process from 'node:process';

const api = new Hono<{ Bindings: Env }>();

api.use(logger());
api.use(cors({
	origin: process.env.FRONTEND_URL || '*',
	allowMethods: ['GET', 'POST']
}));

api.get('/reviews', async (ctx) => {
	try {
		const query = 'SELECT author, comment, rating, post_date FROM reviews';
		const {results} = await ctx.env.DB.prepare(query)
			.all()
		const formattedResults = results.map(r => {
			r.postDate = r.post_date;
			delete r.post_date;
			return r;
		}
		)
		return ctx.json(formattedResults);
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
