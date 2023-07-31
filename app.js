/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const mongoose = require('mongoose');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '64c791f69b87cc57d8bf8c14',
  };

  next();
});
app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
    useNewUrlParser: true,
  });

  app.listen(PORT, () => {
    console.log(`Port ${PORT}`);
  });
}

main();
