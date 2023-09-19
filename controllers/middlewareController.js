const jwt = require('jsonwebtoken');
// const expressValidator = require('express-validator');

const middlewareController = {
  //verifyToken
  //kiem tra da login hay chua
  verifyToken: (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
      //Bearer 1232131
      const accessToken = token.split(' ')[1];

      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          res.status(403).json('Token is not valid');
        } else {
          req.user = user;
          next();
        }
      });
    } else {
      return res.status(403).json({ message: 'Bạn vui lòng đăng nhập', errCode: 3 });
    }
  },
  //delete user
  verifyTokenAndAdminAuth: (req, res, next) => {
    middlewareController.verifyToken(req, res, () => {
      if (req.user.id === req.params.id || req.user.admin) {
        next();
      } else {
        res.status(403).json(" You're not allowed to delete other");
      }
    });
  },
};

module.exports = middlewareController;
