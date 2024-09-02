const { Router } = require('express');
const { check, query } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { getSistemas, getSistema, getData } = require('../controllers/sistemas');

const router = Router();

//Devuelve todos los documentos/sistemas de la base de datos
router.get('/', getSistemas);
//Devuelve solo el documento/sistema indicado con el email
router.get('/:email', [check('email', 'El email es obligatorio').isEmail(), validarCampos], getSistema);
//Devuelve un objeto  que contiene el Valor de cada dato de cada sistema para el email dado
//router.get('/getData/:email', [check('email', 'El email es obligatorio').isEmail(), validarCampos], getData);
router.get(
    '/getData/:email',
    [
        check('email', 'El email es obligatorio').isEmail(),
        query('resultsCount')
            .isInt({ min: 1 })
            .withMessage('La cantidad de resultados debe ser un número entero mayor o igual a 1'),
        validarCampos,
    ],
    getData
);

module.exports = router;
