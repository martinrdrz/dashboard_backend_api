const ok = (mensaje) => ({
    ...mensaje,
});

const error = (mensaje) => ({
    msg: mensaje,
});

module.exports = {
    ok,
    error,
};
