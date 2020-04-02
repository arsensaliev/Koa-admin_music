const db = require("../models/db");

module.exports.get = async (ctx, next) => {
    const data = {
        skills: db.get("skills").value() || [],
        products: db.get("products").value() || [],
        msgsemail: ctx.flash("getIndex")[0]
    };

    return await ctx.render("index", data);
};

module.exports.post = async (ctx, next) => {
    const data = ctx.request.body;
    db.get("contacts")
        .push({
            name: data.name,
            email: data.email,
            message: data.message || ""
        })
        .write();
    ctx.flash("getIndex", "Данные успешно отправились");
    ctx.redirect("/");
};
