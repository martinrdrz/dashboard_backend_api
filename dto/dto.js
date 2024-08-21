const ok = (mensaje) => ({
    ok: true,
    ...mensaje,
});

const error = (mensaje) => ({
    ok: false,
    ...mensaje,
});

module.exports = {
    ok,
    error,
};
