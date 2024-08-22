const ok = (mensaje) => ({
    ...mensaje,
});

const error = (mensaje) => ({
    mensaje,
});

module.exports = {
    ok,
    error,
};
