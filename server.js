const app = require("./app");

const { connect } = require("mongoose");
require("dotenv").config();

const { MONGO_URI, PORT = 5000 } = process.env;

const server = async () => {
  try {
    const db = await connect(MONGO_URI);
    console.log(`Database "${db.connection.name}" connection successful`);
    app.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

server();
