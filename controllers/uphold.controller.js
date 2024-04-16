const { findUser } = require('../helpers/findUser')
const Translation = require('../models/translation')
const Usuario = require('../models/user')
const bodyParser = require('body-parser');
const cloudinary = require('../cloudinary');

const upholdImage = async(req, res = response) => {
  const JWT = req.headers.access_token
  const user = await findUser(JWT)
  
  try {
    const { image } = req.body; 

    console.log(image)

    // Opción con async/await
    const result = await cloudinary.uploader.upload(image, {
      folder: "profile" 
    });

    const userImage = await Usuario.findByIdAndUpdate(user._id, { profile_img: result.url }, { new: true });

    res.json(userImage);

  } catch (error) {
    res.status(500).send({ message: 'Error al subir la imagen', error });
  }

};

module.exports = {
  upholdImage
}