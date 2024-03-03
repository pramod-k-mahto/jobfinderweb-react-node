const express = require('express');
const path = require('path');
const app = express();
const multer = require('multer');
const userModel = require('./database/connect');
const jobModel = require('./database/Joblist');
const cors = require('cors');
const port = process.env.PORT || 9000;
var bodyParser = require('body-parser')

// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())


const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(cookieParser());

const loginMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.myToken;
    if (!token) {
      return res.json({ status: 400, message: 'Not logged in' });
    }

    console.log("------------>", token)

    const identify = jwt.verify(token, "aajflakjhfkfjhlkjsfhfhajkhfakjfhfhklajfhkjfhkajhfhfjfajlkafjkjshbfjhbkjrgbskjgbksjbalfjafkj");
    const user = await userModel.findOne({ _id: identify._id, "tokens.token": token });
    console.log(user)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.filename + '-' + Date.now()+".jpg")
  }
})
 


app.get('/', (req, res) => {
  res.send('Welcome to the home page');
});

app.get('/job', async (req, res) => {
  const jobData = await jobModel.find({});
  console.log(jobData);
  res.json(jobData);
});


const upload = multer({ storage: storage});

app.post('/signup', upload.single("img"),async(req, res) => {
    console.log(req.body)
    // await userModel.create(req.body);

    const data=new userModel({
      image:req.file.filename,
      name:req.body.name,
      email:req.body.email,
      phoneNumber:req.body.phoneNumber,
      password:req.body.password,
      Cpassword:req.body.Cpassword,
      address:req.body.address,
    })
    await data.save();
     res.status(200).json({status:200, message: 'Login successfully' });
  });
app.post('/postJob', async (req, res) => {
  await jobModel.create(req.body);
  return res.status(200).json({ message: 'Job posted successfully' });
});

app.post('/login', async (req, res) => {
  const { password, email } = req.body;
  const user = await userModel.findOne({ email, password });

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = await user.createToken();
  res.cookie('myToken', token);
  return res.status(200).json({ message: 'Login successful' });
});

app.get('/profile', loginMiddleware, (req, res) => {
  res.json(req.user);
});

app.listen(port, () => {
  console.log(`App is listening on port number ${port}`);
});
