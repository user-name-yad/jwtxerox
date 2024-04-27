const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const AdminModel = require('./models/AdminModel.js')

const app = express()
app.use(cors(
    {
        origin:"http://localhost:3000",
        credentials:true
    }
));
app.use(express.json())
app.use(cookieParser())


app.get('/', (req, res) => {
    return res.json('damn im working')
})

//login
app.post('/login', (req, res) => {
    const { email, password } = req.body
    AdminModel.findOne({ email })
        .then(user => {
            if (user) {                
                if (ismatch(password,user.password)) {
                    const accessToken = jwt.sign({ email: email }, "access-token-secret-key", { expiresIn: '15m' })
                    const refreshToken = jwt.sign({ email: email }, "refersh-token-secret-key", { expiresIn: '30m' })
                    return res.json({ Login: true ,ass:accessToken,ref:refreshToken})
                }
                else {
                    return res.json({ Login: false, Message: "no record but user exist" })
                }
            } else {
                return res.json({ Login: false, Message: "no record" });
            }
        }).catch(err => {res.json(err.message)})
})
async function ismatch(password,pswd){
    const ismatch = await bcrypt.compare(password,pswd)
    console.log(ismatch);
    return ismatch
}


app.post('/dashboardd', (req, res) => {
    const {ass} = req.body 
    jwt.verify(ass,'access-token-secret-key',(err,decode)=>{
        if (err) return res.json({ valid: false, message: 'invalid token' })
            else {
                res.json({valid:true})
            }
    })
})


mongoose.connect("mongodb+srv://yadhavan:doomsday@cluster0.3yca6is.mongodb.net/xeroxData?retryWrites=true&w=majority&appName=Cluster0").then(() => {
    console.log("connected to database");
    app.listen(5000, () => {
        console.log("damn its working");
    })
}).catch((err) => {
    console.log(err.message);
})
