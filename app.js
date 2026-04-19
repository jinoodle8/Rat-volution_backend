// app.js

require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('서버 작동 성공')
})

// 라우터 연결
app.use('/auth', require('./routes/auth'))
app.use('/game', require('./routes/game'))
app.use('/leaderboard', require('./routes/leaderboard'))
app.use('/card', require('./routes/card'))

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('db 연결 성공')
        app.listen(PORT, () => {
            console.log(`서버 가동 PORT:${PORT}`)
        })
    })
    .catch((err) => {
        console.error('db 연결 실패', err)
    })