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
const authRouter = require('./API/authRouter,js');

// const createRouter = require('./API/routes.js');
const varifyToken = require('./controllers/varifyToken.js');

app.use(varifyToken);
// app.use('/users', createRouter('users'));
// app.use('/users', createRouter('users'));
// app.use('/posts', createRouter('posts'));
// app.use('/comments', createRouter('comments'));
// app.use('/todos', createRouter('todos'));
app.use('/', authRouter);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});