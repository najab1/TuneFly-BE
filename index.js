require("dotenv").config();
const express = require('express');
const auth = require('./routes/auth_route');
const user = require('./routes/user_route');
const driver = require('./routes/driver_route');
const artist = require('./routes/artist_route');
const stripe = require('./routes/stripe_route');
const notification = require('./routes/notification_route');
const admin = require('./routes/admin_route');
const path = require('path');
const cors = require('cors');
const { errorHandler } = require('./utils/imageUpload');
const { SeedAdmin } = require('./utils/Seed');
const app = express();
const port = process.env.PORT || 3000;
app.use(cors({
  origin: 'http://localhost:5173', // frontend Vite dev server
  credentials: true,
}));

app.use(express.json());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/api/auth/', auth);
app.use('/api/user/', user);
app.use('/api/user/driver', driver);
app.use('/api/user/artist', artist);
app.use('/api/user/stripe', stripe);
app.use('/api/user/notification', notification);
app.use('/api/admin', admin);
app.use(errorHandler)

app.get('/', (req, res) => {
  res.send('Server is running!');
});

SeedAdmin() //add admin when server start



app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong');
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

