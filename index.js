// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authModule = require('./models/signup')
const bodyParser = require('body-parser');
const Path = require('path');
const multer = require('multer');
const dotenv = require('dotenv');
dotenv.config()
const PORT = process.env.PORT || 8000


const app = express();
app.use(cors());
app.use(express.json())
app.use(bodyParser.json());
app.use(express.static('public'))


try {
    mongoose.connect(process.env.MONGODB_URL)
    console.log('database connection ');

} catch (error) {
    console.log(error);

}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/image')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + Path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage })

app.post('/signup', upload.single('file'), async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { filename } = req.file

        const existUser = await authModule.findOne({ email })
        if (existUser) {
            res.send({ code: 409, message: "user existed" })

        }

        const newUser = new authModule({
            photo: filename,
            email,
            password,
            name,
        })

        await newUser.save();
        res.send({ code: 200, message: "sign Done" })

    } catch (error) {
        console.log(error);

        res.status(404).json({ message: "Signup error" })

    }

})

app.post('/login', async (req, res) => {

    authModule.findOne({ email: req.body.email })
        .then((result) => {
            if (result.password !== req.body.password) {
                res.send({ code: 404, message: "password wrong" })
            } else {
                res.send({
                    photo: result.photo,
                    email: result.email,
                    name: result.name,
                    code: 200,
                    message: "user found", token: 'coder'
                })

            }
        }).catch((error) => {
            res.send({ code: 500, message: "user not found", error })

        })


})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});