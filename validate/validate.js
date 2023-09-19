const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');

const complexityOptions = {
  min: 8,
  max: 30,
  lowerCase: 1,
  upperCase: 1,
};

const validate = (data) => {
  const schema = Joi.object({
    username: Joi.string()
      .required()
      .label('Username')
      .min(4)
      .messages({
        'string.base': `"Họ và tên" bắt buộc là chữ`,
        'string.empty': `Họ và tên không được để trống trường này`,
        'string.min': `"Họ và tên" ít nhất là 4 kí tự `,
      })
      .required(),
    email: Joi.string()
      .email()
      .required()
      .label('Email')
      .messages({
        'string.base': `"Email" bắt buộc là chữ`,
        'string.empty': `"Email" không được để trống trường này`,
        'string.min': `"Email" ít nhất là 4 kí tự `,
        'string.email': `"Email" không hợp lệ`,
      })
      .required(),
    password: passwordComplexity(complexityOptions)
      .required()
      .label('Password')
      .messages({
        'string.empty': `"Mật khẩu" không được để trống trường này`,
        'passwordComplexity.uppercase': `"Mật khẩu" phải chứa ít nhất 1 chữ in hoa
      `,
        'passwordComplexity.tooShort': `"Mật khẩu" phải dài ít nhất 8 ký tự`,
        'passwordComplexity.lowercase': `"Mật khẩu" phải chứa ít nhất 1 chữ thường`,
      })
      .required(),
  });
  return schema.validate(data);
};

module.exports = validate;
