const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { getSistemas, getSistema } = require('../controllers/sistema');

const router = Router();

router.get('/', getSistemas);
router.get('/:email', [check('email', 'El email es obligatorio').isEmail(), validarCampos], getSistema);

module.exports = router;
