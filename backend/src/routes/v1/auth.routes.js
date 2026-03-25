const router   = require('express').Router();
const ctrl     = require('../../controllers/auth/auth.controller');
const { registerRules, loginRules } = require('../../validators/auth.validator');
const validate = require('../../middlewares/validate');

router.post('/register', registerRules, validate, ctrl.register);
router.post('/login',    loginRules,    validate, ctrl.login);
router.post('/logout',   ctrl.logout);
module.exports = router;
