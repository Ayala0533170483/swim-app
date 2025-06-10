const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.set('trust proxy', true); /*Correct IP*/
const authRouter = require('./API/authRouter.js');
// const verifyToken = require('./verifyToken');
const usersRouter = require('./API/usersRouter.js');
const poolsRouter = require('./API/poolsRouter.js');
const lessonesRouter = require('./API/lessonsRouter.js');

// const varifyToken = require('./controllers/varifyToken.js');
// app.use(verifyToken);
// כל הבקשות שקשורות ל-auth (login/signup) עוברות בלי varifyToken
app.use('/', authRouter);
// app.use('/teacher', teacherRouter);
// app.use('/student', studentRouter);
app.use('/users', usersRouter);
app.use('/pools', poolsRouter);
app.use('/lessons', lessonesRouter);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
