// Carga de protocolo http
const { createServer } = require("http");

// Carga de aplicación de express
const app = require("./src/app");

// Carga de variables de entorno
const dotenv = require("dotenv");
dotenv.config();

// Configuracion de bbdd
require("./src/config/db");

// Creación del servidor
const server = createServer(app);

// Definición del puerto
const PORT = process.env.PORT || 3000;

// Arranque del servidor
server.listen(PORT);

// Handler de eventos del servidor
server.on("listening", () => console.log(`Server running on port: ${PORT}`));
server.on("error", (error) => console.log(error));
