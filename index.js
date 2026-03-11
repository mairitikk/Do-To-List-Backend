const dotenv = require("dotenv");
dotenv.config();

const http = require("http");
const app = require("./src/app");
const { seedDatabase } = require("./src/helpers/seed");

const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

server.listen(PORT);
server.on("listening", async () => {
  console.log(`Server running on port: ${PORT}`);
  try {
    await seedDatabase();
  } catch (err) {
    console.error("Seed failed:", err.message);
  }
});
server.on("error", (error) => console.log(error));
