const Router = require('express');
const authController = require('./authController');
const {check} = require('express-validator');

const router = new Router();

authController.connectDB();

router.post('/registration',
 [
    check('userName', "username can't be empty").notEmpty(),
    check('password', "password must be longer 6 symbols").isLength({min:7})
], 
 authController.registration.bind(authController))

router.post('/login', authController.login.bind(authController))

router.get('/users', authController.getUsers.bind(authController))

router.post('/addUsers', authController.addUsers.bind(authController))

module.exports = router;