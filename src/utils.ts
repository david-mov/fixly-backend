import { type Context } from 'hono';
import { StatusCode } from 'hono/utils/http-status';

export const createError = (ctx: Context, status: StatusCode, message?: string) => {
  const body = {
    status,
    statusText: message ?? 'Something went wrong. Please try again later.'
  };

  return ctx.json(body, status);
};