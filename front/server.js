const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));

const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Front lancé sur le port ${PORT}`);
});

// Arrêt gracieux du serveur front sinon il y a un code d'arrêt 137
function shutdown() {
    console.log("Arrêt du serveur front...");

    server.close(() => {
        console.log("Serveur front arrêté proprement");
        process.exit(0);
    });
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);