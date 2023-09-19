const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validate = require('../validate/validate');

//   check('name')
//     .trim()
//     .escape()
//     .not()
//     .isEmpty()
//     .withMessage('User name can not be empty!')
//     .bail()
//     .isLength({ min: 3 })
//     .withMessage('Minimum 3 characters required!')
//     .bail()
//     .isAlpha()
//     .withMessage('Name must be alphabet letters.')
//     .bail(),
//   check('email')
//     .trim()
//     .normalizeEmail()
//     .not()
//     .isEmpty()
//     .withMessage('Invalid email address!')
//     .bail(),
//   (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
//     next();
//   },
// ];
let refreshTokens = [];
const authController = {
  //REGISTER
  registerUser: async (req, res) => {
    try {
      const { error } = validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      const emailExists = await User.findOne({
        email: req.body.email,
      });
      if (emailExists) {
        return res.status(401).json({ message: `Email: ${emailExists.email} đã tồn tại` });
      }
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);

      const newUser = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: hashed,
      });
      //save databse
      const user = await newUser.save();

      res.status(201).json({
        user,
        message: 'Tạo tài khoản thành công',
      });
    } catch (error) {
      return res.status(403).json({ message: error.message });
    }
  },
  //generate access token
  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        admin: user.admin,
      },
      process.env.JWT_ACCESS_KEY,
      {
        expiresIn: '1d',
      }
    );
  },
  //generate refresh token
  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        admin: user.admin,
      },
      process.env.JWT_REFRESH_TOKEN,
      {
        expiresIn: '365d',
      }
    );
  },
  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(401).json({ email: 'Địa chỉ email không đúng' });
      }
      const validPassword = await bcrypt.compare(req.body.password, user.password);
      if (!validPassword) {
        return res.status(401).json({ password: 'Bạn nhập sai mật khẩu' });
      }
      if (user && validPassword) {
        const accessToken = authController.generateAccessToken(user);
        const refreshToken = authController.generateRefreshToken(user);
        refreshTokens.push(refreshToken); //luu refreshToken vao database
        //save cookie
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: false,
          path: '/',
          sameSite: 'strict',
        });
        const { password, ...userNotPassword } = user._doc;
        res.status(200).json({ userNotPassword, accessToken, message: 'Đăng nhập thành công' });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  requestRefreshToken: async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json('Vui lòng đăng nhập');
    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json('Refresh token is not valid ');
    }
    jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, (err, user) => {
      if (err) {
        console.log(err);
      } else {
        refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
        //create accessToken,refreshToken
        const newAccessToken = authController.generateAccessToken(user);
        const newRefreshToken = authController.generateRefreshToken(user);
        refreshTokens.push(newRefreshToken);
        res.cookie('refreshToken', newRefreshToken, {
          httpOnly: true,
          secure: false,
          path: '/',
          sameSite: 'strict',
        });
        res.status(200).json({ accessToken: newAccessToken });
      }
    });
    // res.status(200).json(refreshToken);
  },
  userLogout: async (req, res) => {
    res.clearCookie('refreshToken');
    refreshTokens = refreshTokens.filter((token) => token !== req.cookies.refreshToken);
    res.status(200).json('Đăng xuất thành công');
  },
};
module.exports = authController;
