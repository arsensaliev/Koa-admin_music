const crypto = require("crypto");
const db = require("../models/db");

module.exports.authorization = login => {
    return new Promise((resolve, reject) => {
        const user = db
            .get("users")
            .find({ email: login.email })
            .value();
        console.log(user);

        if (user) {
            crypto.pbkdf2(
                login.password,
                user.salt,
                1000,
                512,
                "sha512",
                (err, hash) => {
                    if (err) {
                        return reject(
                            new Error("Возникла ошибка, попробуйте еще!")
                        );
                    }

                    resolve({
                        login: user.email,
                        password: hash.toString("hex") === user.hash
                    });
                }
            );
        } else {
            resolve({
                login: null,
                password: null
            });
        }
    });
};

module.exports.setUser = data => {
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.pbkdf2(data.password, salt, 1000, 512, "sha512", (err, hash) => {
        db.get("users")
            .push({
                email: data.email,
                salt,
                hash: hash.toString("hex")
            })
            .write();
    });
};
