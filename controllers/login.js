const auth = require("../libs/auth");
module.exports.get = async (ctx, next) => {
    if (ctx.session.auth) {
        return ctx.redirect("/admin");
    }

    return ctx.render("login", {
        msgslogin: ctx.flash("login")[0]
    });
};

module.exports.post = async (ctx, next) => {
    console.log("fafaw");

    if (ctx.session.auth) {
        return ctx.redirect("/admin");
    }

    const login = {
        email: ctx.request.body.email,
        password: ctx.request.body.password
    };
    try {
        const status = await auth.authorization(login);

        if (status.password && login.email === status.login) {
            ctx.session.auth = status.password;
            console.log(ctx.session.auth);
            return ctx.redirect("/admin");
        } else {
            ctx.flash("login", "Не правильный логин или пароль");
            return ctx.redirect("/login");
        }
    } catch (error) {
        ctx.flash("login", err.message);

        return ctx.redirect("/login");
    }
};
