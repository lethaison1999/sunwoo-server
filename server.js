const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const uploadRouter = require('./routes/upload');
const Grid = require('gridfs-stream');
dotenv.config();
const app = express();
//connect db
mongoose
  .connect(process.env.MONGOOSE_URL)
  .then(() => {
    console.log('Kết nối database thành công !');
  })
  .catch((err) => {
    console.log('Kết nối database thất bại');
  });
//creating bucket
let bucket;
mongoose.connection.on('connected', () => {
  let db = mongoose.connections[0].db;
  bucket = new mongoose.mongo.GridFSBucket(db, {
    bucketName: 'newBucket',
  });
  // console.log(bucket);
});
const conn = mongoose.createConnection(process.env.MONGOOSE_URL, {
  useNewUrlParser: true,
});

// Init gfs
let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(express.json());

//routes
app.use('/v1/auth', authRouter);
app.use('/v1/user', userRouter);
app.use('/v1/upload', uploadRouter);
app.listen(process.env.PORT || 8000, () => {
  console.log(`Server is running : localhost:${process.env.PORT}`);
});
