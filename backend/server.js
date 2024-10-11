const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');
const workspaceRoutes = require('./routes/workspaces');
const projectRoutes = require('./routes/projects');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/users', userRoutes); // User routes
app.use('/api/workspaces', workspaceRoutes); // Workspace routes
app.use('/api/projects', projectRoutes); // Project routes

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});