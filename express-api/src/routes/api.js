const { checkToken } = require('../middlewares/auth.middleware');

const router = require('express').Router();

// Rutas
router.use('/todos', require('./api/todos'));

router.use('/users', require('./api/users'));


module.exports = router;