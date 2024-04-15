const { codeExist } = require('../helpers/db-validators')
const { findUser } = require('../helpers/findUser')
const { hourGenerate } = require('../helpers/hourGenerate')
const Translation = require('../models/translation')
const Usuario = require('../models/user')


const translationPOST = async(req, res = response) => {
  
  const { code } = req.body
  const JWT = req.headers.access_token
  const user = await findUser(JWT)

  const data = {
    code,
    chart: user.name,
    create_at: hourGenerate(),
    turist_name: user.name,
    turist_id: user._id
  }

  try {

    const translation = await new Translation( data )
    await translation.save()
    return res.json(translation)

    
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: 'Error de Servidor'
    })
  }
}

const acceptTourist = async(req, res = response) => {

  const { turist_id, transfer_id, origin, destination, date, hour, id_translation } = req.body

  const turistValidation = await Usuario.find( { _id: turist_id, role: "TURIST" } );
  const transferValidation = await Usuario.find( { _id: transfer_id, role: "OPERATOR" } );

  if( !turistValidation || !transferValidation ) {
    return res.status(400).json({
      msg: 'El Turista o el Trasladista no existen'
    })
  }

  const data = {
    turist_id,
    transfer_id,
    origin, 
    destination,
    date,
    hour,
    state: "PROCESS"
  }

  try {
    const translation = await Translation.findByIdAndUpdate(id_translation, data, { new: true });
    res.json(translation);
    
  } catch (error) {
    res.status(500).json({
      msg: 'Error al actualizar usuario',
      error
    });
  }


}


const getCompanies = async(req, res = response) => {
  const { type } = req.params; 
  
  const companies = await Usuario.find( { role: "COMPANY", type_company: type }, { uid: 1, code: 1, name: 1, type_company: 1  } );
  res.json( { companies } );
};


const getMyRequest = async(req, res = response) => {
  const JWT = req.headers.access_token
  const user = await findUser(JWT)
  
  const turistPending = await Translation.find( { code: user.code, state: "PENDING" } );
  const count = turistPending.length;

  res.json( { 
    turistPending,
    count 
  } );

};

const getMyTranslations = async(req, res = response) => {
  const JWT = req.headers.access_token
  const user = await findUser(JWT)
  
  const translations = await Translation.find( { transfer_id: user._id, state: "PROCESS" } );
  const count = translations.length;

  res.json( { 
    translations,
    count 
  } );

};

const editTranslation = async(req, res = response) => {
  let { id_translation, chart, operator_IMG, turist_IMG } = req.body

  const datosActualizados = {
    ...(chart && {chart}),
    ...(operator_IMG && {operator_IMG}),
    ...(turist_IMG && {turist_IMG}),
  };

  try {
    const translate = await Translation.findByIdAndUpdate(id_translation, datosActualizados, { new: true });
    res.json(translate);
  } catch (error) {
    res.status(500).json({
      msg: 'Error al actualizar Traslado',
      error
    });
  }

 
}




module.exports = {
  translationPOST,
  getCompanies,
  getMyRequest,
  acceptTourist,
  getMyTranslations,
  editTranslation
}