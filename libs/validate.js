module.exports = (name, size) => {
    let response;

    if (name === '' || size === 0) {
        response = {
            mes: "Не загружена картинка",
            err: true,
        }
    }

    return response;
};
