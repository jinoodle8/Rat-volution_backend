// 라이브러리 호출
require('dotenv').config();;
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

// express 서버 생성
const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정(유니티 통신)
app.use(cors());
app.use(express.json());

// 확인용 라우터
app.get('/',(req, res) => {
    res.send('서버 작동 성공')
})

// mongoDB 연결, 서버 실행
mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log('db 연결 성공')

        app.listen(PORT, ()=>{
            console.log('서버 가동')
        })
    })
    
    .catch((err)=>{
        console.err('db 연결 실패')
    })