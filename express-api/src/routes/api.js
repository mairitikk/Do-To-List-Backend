const { checkToken } = require('../middlewares/auth.middleware');

const router = require('express').Router();

// Rutas
//TODO: hay que ver mejor esto, por que tenemos que bloquear las ruas que no vayan a ser publicas y no se puede sin definir cual es la publica.
router.use('/teachers', require('./api/teachers'));
router.use('/students', checkToken, require('./api/students'));
router.use('/users', require('./api/users'));
router.use('/locations', checkToken, require('./api/locations'));
router.use('/subjects', checkToken, require('./api/subjects'));
router.use('/class', checkToken, require('./api/class.hours'));
router.use('/departments', require('./api/departments'));
router.use('/ratings', require('./api/ratings'));
router.use('/chats', checkToken, require('./api/chats'));

module.exports = router;