const User = require('../models/User');
const bcrypt = require('bcrypt');

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const user = await User.find({}).populate('user_file');

      if (user) {
        res.status(200).json(user);
      } else {
        res.status(403).json({ message: 'Người dùng không tồn tại' });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getSingleUser: async (req, res) => {
    try {
      const user = await User.findOne({ id: req.params._id });
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: 'Id Người dùng không tồn tại' });
      }
    } catch (error) {
      res.status(500).json({ message: 'not foud' });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (user) {
        res.status(200).json({ message: 'Xóa người dùng thành công' });
      } else {
        res.status(500).json({ message: 'not foud' });
      }
    } catch (error) {
      res.status(500).json({ message: 'not foud' });
    }
  },
};
module.exports = userController;
