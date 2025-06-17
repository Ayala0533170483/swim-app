const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const verifyToken = require('./middleware/verifyToken');

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.set('trust proxy', true);

const authRouter = require('./api/authRouter.js');
const usersRouter = require('./api/usersRouter.js');
const poolsRouter = require('./api/poolsRouter.js');
const lessonesRouter = require('./api/lessonsRouter.js');
const registerLessonsRouter = require('./api/registerLessonsRouter.js')
const messagesRouter = require('./api/messagesRouter.js');
const branchesRouter = require('./api/branchesRouter.js');

app.use('/', authRouter);
app.use('/users', verifyToken, usersRouter);
app.use('/pools', verifyToken, poolsRouter);
app.use('/lessons', verifyToken, lessonesRouter);
app.use('/registerLessons', verifyToken, registerLessonsRouter)
app.use('/messages', messagesRouter);
app.use('/branches', branchesRouter);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});