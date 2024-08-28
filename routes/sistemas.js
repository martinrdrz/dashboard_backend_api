const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { getSistemas, getSistema, getData } = require('../controllers/sistemas');

const router = Router();

//Devuelve todos los documentos/sistemas de la base de datos
router.get('/', getSistemas);
//Devuelve solo el documento/sistema indicado con el email
router.get('/:email', [check('email', 'El email es obligatorio').isEmail(), validarCampos], getSistema);
//Devuelve un objeto  que contiene el Valor de cada dato de cada sistema para el email dado
router.get('/getData/:email', [check('email', 'El email es obligatorio').isEmail(), validarCampos], getData);

module.exports = router;
