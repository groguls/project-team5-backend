const app = require("./app");

const { connect } = require("mongoose");
require("dotenv").config();

const server = async () => {
  try {
    const db = await connect(process.env.MONGO_URI);
    console.log(`Database "${db.connection.name}" connection successful`);
    app.listen(PORT, () => {
      console.log(
        `Server running. Use our API on port: ${process.env.PORT || 5000}`
      );
    });
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

server();
