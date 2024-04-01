const { Router } = require('express')
const { check } = require('express-validator')
const { login } = require('../controllers/auth.controller')
const { validarCampos } = require('../middlewares/validar-campos')


const router = Router()

router.post('/login', [
  check('username', 'El username es obligatorio').not().isEmpty(),
  check('password', 'La contraseña es obligatoria').not().isEmpty(),
  validarCampos
], login )




module.exports = router