const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./models/user.model'); // Импорт модели пользователя
require('dotenv').config();
const fs = require('fs');
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const bcrypt = require('bcrypt');
const saltRounds = 10;
const privateKey = fs.readFileSync(process.env.PRIVATE_KEY_PATH);
const refreshTokenKey = fs.readFileSync(process.env.REFRESHTOKEN_KEY_PATH);
//app.use(cors())


// Сервер (Express)
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Accept',          
    'X-Requested-With' 
  ],
  methods: ['GET', 'POST', 'DELETE'],
}));

app.use(express.json());
const bookSearchRoute = require('./routes/booksSearch');
const bookAddRoute = require('./routes/Books');
const reviewsRoute = require("./routes/reviews")
const verifyToken = require("./middleware/auth"); 
mongoose.connect('mongodb://localhost:27017/book-app')

// Подключаем маршруты
app.use("/api", bookSearchRoute);
app.use("/api", bookAddRoute);
app.use("/api", reviewsRoute);

app.post('/api/register', async (req, res) => {
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        })

        const userId = user._id;
        const accessToken = jwt.sign({
            userId: user._id
        }, privateKey, { algorithm: 'RS256', expiresIn: '15m' })
         //переписать для использования HMAC
        const refreshToken = jwt.sign({ 
            userId: user._id
        },  refreshTokenKey, { algorithm: 'HS256', expiresIn: '7d' });
       /* res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: "none",
            domain: "localhost",
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000
        }) */

        res.json({ status: 'ok', user: accessToken, refreshToken: refreshToken })
    } catch (err) {
        console.log(err);
        res.json({ status: 'error', error: 'Dublicate email'})
    }
    
})

app.post('/api/login', async (req, res) => {
    
    const user = await User.findOne({ 
        email: req.body.email, 
    })
      
    if (!user) {
            console.warn("Пользователь не найден:", req.body.email);
            return res.status(404).json({ status: 'error', message: "Пользователь не найден" });
        }

     const passwordMatch = await bcrypt.compare(req.body.password, user.password);
        console.log("Результат сравнения паролей:", passwordMatch);

        if (!passwordMatch) {
            console.warn("Неверный пароль для:", req.body.email);
            return res.status(401).json({ status: 'error', message: "Неверный пароль" });
        }
    if (user && await bcrypt.compare(req.body.password, user.password)) {
        const accessToken = jwt.sign({
           userId: user._id
        }, privateKey, { algorithm: 'RS256', expiresIn: '15m' })
        
        const refreshToken = jwt.sign({ 
            userId: user._id
        },  refreshTokenKey, { algorithm: 'HS256', expiresIn: '7d' });
        
       // await saveRefreshToken(user._id, refreshToken);
        /*res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            
            domain: 'localhost', // Явно указываем домен
            path: '/' ,
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000
        }) */
       // sessionStorage.setItem('userId', user._id);
        
      //  console.log("Пользователь успешно вошел:", user.email);
        return res.json({ status: 'ok', accessToken: accessToken, refreshToken: refreshToken});
    } else {
        return res.json({ status: 'error', user: false })
    }    
})

app.post('/api/token', async (req, res) => {
  //  const token = req.cookies.refreshToken;
  //    console.log("Refresh Token:", token);
 //  const userId = sessionStorage.getItem('userId'); 
    const { refreshToken } = req.body;
     console.log("Refresh Token:", refreshToken);
  //  const token = await getRefreshToken(userId);
    if (!refreshToken) return res.sendStatus(401);
    jwt.verify(refreshToken, refreshTokenKey, (err, decoded) => {
      //  console.error("❌ Ошибка верификации токена:", err.message);
        if (err) return res.sendStatus(403);
        const newAccessToken = jwt.sign({ 
           userId: decoded.userId
        }, privateKey, { algorithm: 'RS256', expiresIn: '15m' });
       
        res.json({ accessToken: newAccessToken });
    });
});


app.listen(1337, () => {
    console.log('Server started at 1337')
})


