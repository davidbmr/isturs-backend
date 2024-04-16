const { Router } = require('express')
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos')
const { upholdImage } = require('../controllers/uphold.controller')
const { validarJWT } = require('../middlewares/validar-jwt')


const router = Router()

router.post('/upholdImage', [
  validarJWT,
  validarCampos
], upholdImage )


module.exports = router