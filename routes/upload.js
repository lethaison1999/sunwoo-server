const express = require('express');

const router = express.Router();
const fileController = require('../controllers/fileController');
const upload = require('../controllers/uploadMiddleware');
const middlewareController = require('../controllers/middlewareController');

router.post('/', upload.single('pdf'), middlewareController.verifyToken, fileController.uploadFile);

router.get('/getall', fileController.getAllFile);
router.get('/file/:id', fileController.getSingleFile);
router.get('/search', fileController.searchNameFile);
// router.get('/paginate', fileController.paginateFile);

module.exports = router;
