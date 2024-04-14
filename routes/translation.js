const { Router } = require('express')
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos')
const { translationPOST, getCompanies, getMyRequest, acceptTourist, getMyTranslations } = require('../controllers/translation.controller')
const { codeExist } = require('../helpers/db-validators')
const { validarJWT } = require('../middlewares/validar-jwt')


const router = Router()

router.post('/postTranslation', [
  check('code', 'El campo "code" es obligatorio').not().isEmpty(),
  check('code', 'No es un Code permitido').custom( codeExist ),
  validarCampos
], translationPOST )


router.get('/getCompanies/:type',[
  validarJWT,
  check('type', 'El parametro "type" es obligatorio').not().isEmpty(),
  validarCampos
], getCompanies)


router.get('/getMyRequest',[
  validarJWT,
  validarCampos
], getMyRequest)

router.get('/myTranslations',[
  validarJWT,
  validarCampos
], getMyTranslations)

router.post('/acceptTourist', [
  check('id_translation', 'El campo "id_translation" es obligatorio').not().isEmpty(),
  check('id_translation', 'El campo "id_translation" no es un id valido').isMongoId(),

  validarCampos
], acceptTourist )




module.exports = router