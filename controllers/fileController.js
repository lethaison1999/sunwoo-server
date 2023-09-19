// const File = require('../models/File');
const File = require('../models/File');
const User = require('../models/User');

const fileController = {
  uploadFile: async (req, res) => {
    try {
      const pdf = new File({
        name: req.file.originalname,
        data: req.file.buffer,
        username: req.body.username,
      });

      if (req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/png') {
        return res.status(401).json({ message: 'Định dạng tệp bắt buộc là tệp PDF ' });
      }
      await pdf.save();
      res
        .status(201)
        .json({ message: 'Tệp PDF đã được tải lên và lưu trữ thành công', errCode: 0 });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Đã xảy ra lỗi khi tải lên tệp PDF' });
    }
  },
  getAllFile: async (req, res) => {
    // res.setHeader('Content-Type', 'application/pdf');
    const file = await File.find({});
    if (file) {
      return res.status(200).json(file);
    } else {
      return res.status(404).json({ message: 'Error' });
    }
  },
  getSingleFile: async (req, res) => {
    try {
      const pdf = await File.findById(req.params.id);
      if (!pdf) {
        res.status(404).json({ message: 'Không tìm thấy tệp PDF' });
        return;
      }
      // Trả về dữ liệu PDF dưới dạng binary
      // res.setHeader('Content-Type', 'application/pdf');
      res.status(200).json(pdf.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Đã xảy ra lỗi khi truy cập tệp PDF' });
    }
  },
  // paginateFile: async (req, res) => {
  //   try {
  //     let search = '';
  //     if (req.query.search) {
  //       search = req.query.search;
  //     }
  //     let page = 1;
  //     if (req.query.page) {
  //       page = req.query.page;
  //     }
  //     const limit = 3;
  //     const file = await File.find({
  //       $or: [{ name: { $regex: '.*' + search + '.*', $options: 'i' } }],
  //     })
  //       .limit(limit * 1)
  //       .skip((page - 1) * limit)
  //       .exec();
  //     const count = await File.find({
  //       $or: [{ name: { $regex: '.*' + search + '.*', $options: 'i' } }],
  //     }).countDocuments();

  //     if (!file && !count) {
  //       return res.status(404).json({ message: 'File and count not found' });
  //     } else {
  //       return res
  //         .status(200)
  //         .json({ file, totalPages: Math.ceil(count / limit), currentPage: page });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },
  searchNameFile: async (req, res) => {
    try {
      const search = req.query.search || '';

      const fileSearch = await File.find({ name: { $regex: search, $options: 'i' } });

      if (fileSearch.length === 0) {
        return res.status(200).json({ message: 'Tên không tồn tại', errCode: 3 });
      }
      return res.status(200).json({ fileSearch, message: 'OK' });
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};
module.exports = fileController;
