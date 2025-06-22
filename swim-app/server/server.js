const express = require('express');
const path = require('path');
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
const lessonesRouter = require('./api/lessonsRouter.js');
const registerLessonsRouter = require('./api/registerLessonsRouter.js')
const messagesRouter = require('./api/messagesRouter.js');
const branchesRouter = require('./api/branchesRouter.js');
const emailRouter = require('./api/emailRouter.js');

app.use('/', authRouter);
app.use('/users', verifyToken, usersRouter);
app.use('/lessons', verifyToken, lessonesRouter);
app.use('/registerLessons', verifyToken, registerLessonsRouter)
app.use('/messages', messagesRouter);
app.use('/pools', branchesRouter);
app.use('/branches', branchesRouter);
app.use('/email', verifyToken, emailRouter);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
