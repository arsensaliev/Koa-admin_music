const promptly = require("promptly");
const signale = require("signale");
const db = require('../models/db');
const auth = require("../libs/auth");

const validatorPassword = value => {
    if (value.length < 8) {
        signale.warn("Пароль должен быть не менее 8-ми символов");
        throw new Error();
    }

    return value;
};

const validatorEmail = value => {
    const reg = /^([A-Za-z009_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    if (reg.test(value)) {
        return value;
    } else {
        signale.warn("Не корректный email");
        throw new Error();
    }
};

const registerUser = (email, password) => {
    auth.setUser({ email, password });
    signale.success(`Регистрация прошла успешно для пользователя ${email}`);
};

async function askForPassword() {
    const password = await promptly.password("Введите пароль: ", {
        replace: "*",
        validator: validatorPassword
    });

    const repeatPassword = await promptly.password("Повторите пароль: ", {
        replace: "*",
        validator: validatorPassword
    });

    if (password === repeatPassword) {
        return password;
    } else {
        signale.warn("Пароли не совпадают. Попробуйте ещё раз!");
        askForPassword();
    }
}
async function main() {
    const email = await promptly.prompt("Введите email пользователя: ", {
        validator: validatorEmail
    });

    const isContainsEmail = db
        .get("users")
        .find({ email })
        .value()
        ? true
        : false;

    if (isContainsEmail) {
        signale.warn("Такой пользователь уже существует. Попробуйте ещё!");
        main();
    } else {
        const password = await askForPassword();

        registerUser(email.trim(), password.trim());
    }
}

main();
