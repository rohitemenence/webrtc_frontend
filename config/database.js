const mongoose = require("mongoose");
const http = require('http');


mongoose.set('bufferTimeoutMS', 50000);

const connectDatabase = async () => {
  await mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedtopology: true,

  });
  console.log(`Mongo db is successfully connected to the server`);
};

module.exports = connectDatabase;
