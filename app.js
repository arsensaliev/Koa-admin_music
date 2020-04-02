const Koa = require("koa");
const Pug = require("koa-pug");
const fs = require("fs");
const serve = require("koa-static");
const session = require("koa-session");
const flash = require("koa-better-flash");

const config = require("./config");
const router = require("./routes");
const port = process.env.PORT || 3000;

const app = new Koa();

const pug = new Pug({
    viewPath: "./views/pages",
    app: app
});

app.use(serve("./public"));
app.keys = ["loftschool"];
app.use(session(config.session, app));
app.use(flash());
app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;