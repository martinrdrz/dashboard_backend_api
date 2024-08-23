const { Router } = require('express');
const { getAlert, setAlert } = require('../controllers/alerts');

const router = Router();

router.get('/', getAlert);
router.post('/', setAlert);

module.exports = router;
