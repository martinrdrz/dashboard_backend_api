const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { getSistemas, getSistema } = require('../controllers/sistemas');

const router = Router();

//Devuelve todos los documentos/sistemas de la base de datos
router.get('/', getSistemas);
//Devuelve solo el documento/siste indicado con el email
router.get('/:email', [check('email', 'El email es obligatorio').isEmail(), validarCampos], getSistema);

module.exports = router;
