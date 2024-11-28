const express = require("express");
const exphbs = require("express-handlebars");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Configurer Handlebars comme moteur de templates
app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set("views", "./views");

// Import des routes
const authRoutes = require("./routes/authRoutes");
const catwayRoutes = require("./routes/catwayRoutes");
const pageRoutes = require("./routes/pageRoutes");

const isTestEnv = process.env.NODE_ENV === "test";
const mockAuth = require("./middleware/mockAuth");

// Utilisation des routes
if (isTestEnv) {
    // Désactiver l'authentification pour les tests
    app.use("/api/catways", mockAuth, catwayRoutes);
    app.use("/", mockAuth, pageRoutes);
    app.use("/catways", mockAuth, catwayRoutes);
    app.use("/api/auth", mockAuth, authRoutes);
} else {
    app.use("/api/catways", catwayRoutes);
    app.use("/", pageRoutes);
    app.use("/catways", catwayRoutes);
    app.use("/api/auth", authRoutes);
}


// Page d'accueil pour tester si le serveur est lancé
app.get("/", (req, res) => {
    res.send("Bienvenue sur l'API du Port de Plaisance Russell");
});

// Exporter l'application sans démarrer le serveur
module.exports = app;
