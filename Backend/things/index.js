const express = require('express');
const cors = require('cors');
const app = express();
const morgan = require('morgan');
const authenticateToken = require('./middleware/auth');
app.use(cors());
app.use(express.json());
require('dotenv').config();



app.use(morgan('dev'));
// Import and use routes
app.use('/api/register', require('./routes/register'));
app.use('/api/login', require('./routes/login'));


app.use(authenticateToken);

app.use('/api/users', require('./routes/users'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/user-projects', require('./routes/userproject'));



app.listen(4000,() => console.log('Server running on port 4000'));

