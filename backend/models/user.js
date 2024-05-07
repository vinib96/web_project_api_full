const mongoose = require('mongoose');

const validator = require('validator');

const validateEmail = (email) => validator.isEmail(email);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Jacques Cousteau',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Explorer',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,

    validate: {
      validator(v) {
        return /^(https?):\/\/(www\.)?[\w-@:%+~#=]+[.][.\w/\-?#=&~@:()!$+%]*$/gm.test(
          v
        );
      },
      message: (props) => `${props.value} não é válido!`,
    },
    default:
      'https://practicum-content.s3.us-west-1.amazonaws.com/resources/moved_avatar_1604080799.jpg',
  },
  email: {
    type: String,
    required: [true, 'Campo Obrigatório'],
    unique: true,
    validate: [validateEmail, 'O Email é inválido'],
  },
  password: {
    type: String,
    required: [true, 'Campo Obrigatório'],
    minlength: 8,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
