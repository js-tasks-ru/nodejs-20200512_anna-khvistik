const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let subscribers = {};

router.get('/subscribe', async (ctx, next) => {
  const id = Math.random();
  ctx.res.on('close', function() {
    delete subscribers[id];
  });

  const message = await new Promise((resolve) => {
    subscribers[id] = resolve;
  });
  ctx.body = message;
});

router.post('/publish', async (ctx, next) => {
  const message = ctx.request.body.message;
  if (!message) {
    return;
  }

  ctx.body = message;

  Object.values(subscribers).forEach((resolve) => {
    resolve(message);
  });

  subscribers = {};
});

app.use(router.routes());

module.exports = app;
