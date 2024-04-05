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
    turist_name: user.name
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



const getCompanies = async(req, res = response) => {
  const { type } = req.params; 
  
  const companies = await Usuario.find( { role: "COMPANY", type_company: type }, { uid: 1, code: 1, name: 1, type_company: 1  } );
  res.json({ companies });
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


module.exports = {
  translationPOST,
  getCompanies,
  getMyRequest
}