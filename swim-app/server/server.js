const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const verifyToken = require('./middleware/verifyToken');

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.set('trust proxy', true);
const authRouter = require('./API/authRouter.js');
// const verifyToken = require('./verifyToken');
const usersRouter = require('./API/usersRouter.js');
const poolsRouter = require('./API/poolsRouter.js');
const lessonesRouter = require('./API/lessonsRouter.js');
const messagesRouter = require('./API/messagesRouter.js');
const branchesRouter = require('./API/branchesRouter.js');

// const varifyToken = require('./controllers/varifyToken.js');
// app.use(verifyToken);

app.use('/', authRouter);
app.use('/users',verifyToken, usersRouter);
app.use('/pools', verifyToken, poolsRouter);
app.use('/lessons', verifyToken, lessonesRouter);
app.use('/messages', messagesRouter);
app.use('/branches', branchesRouter);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
