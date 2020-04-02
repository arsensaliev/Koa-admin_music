const fs = require("fs");
const _path = require("path");
const util = require("util");
const unlink = util.promisify(fs.unlink);
const rename = util.promisify(fs.rename);
const validation = require("../libs/validate");
const db = require("../models/db");

module.exports.get = async (ctx, next) => {
    console.log(ctx.session.auth);
    if (!ctx.session.auth) {
        return ctx.redirect("/login");
    }

    return await ctx.render("admin", {
        msgskill: ctx.flash("setSkills")[0],
        msgfile: ctx.flash("setItem")[0]
    });
};

module.exports.setSkills = async (ctx, next) => {
    let { age, concerts, cities, years } = ctx.request.body;

    if (!age) age = 0;
    if (!concerts) concerts = 0;
    if (!cities) cities = 0;
    if (!years) years = 0;

    db.set("skills[0].number", age).value();
    db.set("skills[1].number", concerts).value();
    db.set("skills[2].number", cities).value();
    db.set("skills[3].number", years).value();

    db.write();
    ctx.flash("setSkills", "Успешно!");
    ctx.redirect("/admin");
};

module.exports.setItem = async (ctx, next) => {
    const data = ctx.request.body;
    const { name, size, path } = ctx.request.files.photo;
    const responseError = validation(name, size);

    if (responseError) {
        console.log("Err");
        await unlink(path);
        ctx.flash("setItem", responseError.mes);
        return ctx.redirect("/admin");
    }

    let fileName = _path.join(process.cwd(), "public", "upload", name);

    const errUpload = await rename(path, fileName);

    if (errUpload) {
        console.log("error1", errUpload);
        ctx.flash("setItem", "При загрузке картинки произошла ошибка");
        return ctx.redirect("/admin");
    }

    db.get("products")
        .push({
            src: `./upload/${name}`,
            name: data.name,
            price: data.price
        })
        .write();

    ctx.flash("setItem", "Успешно добавилось");
    return ctx.redirect("/admin");
};
