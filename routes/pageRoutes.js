const express = require("express");
const router = express.Router();
const axios = require("axios");

// Page d'accueil
router.get("/", (req, res) => {
    res.render("home", {
        title: "Accueil",
        apiDocsLink: "/documentation",
    });
});

// Tableau de bord
router.get("/dashboard", (req, res) => {
    res.render("dashboard", {
        title: "Tableau de bord",
    });
});

// Liste des catways
router.get("/catways", async (req, res) => {
    try {
        const token = req.cookies.token; // Récupérer le token stocké
        if (!token) {
            return res.redirect("/login"); // Redirigez si aucun token n'est trouvé
        }

        const response = await axios.get("http://localhost:8000/api/catways", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        res.render("catways", { catways: response.data });
    } catch (error) {
        res.status(500).send("Erreur lors de la récupération des catways.");
    }
});

// Détails d'un catway
router.get("/catways/:id", async (req, res) => {
    try {
        const token = req.cookies.token; // Récupérer le token stocké
        if (!token) {
            return res.redirect("/login");
        }

        const { id } = req.params;
        const response = await axios.get(`http://localhost:8000/api/catways/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        res.render("catwayDetails", { catway: response.data });
    } catch (error) {
        res.status(500).send("Erreur lors de la récupération des détails du catway.");
    }
});

// Liste des réservations
router.get("/reservations", async (req, res) => {
    try {
        const token = req.cookies.token; // Récupérer le token stocké
        if (!token) {
            return res.redirect("/login"); // Redirigez si aucun token n'est trouvé
        }

        const response = await axios.get("http://localhost:8000/api/catways/reservations", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        res.render("reservations", { reservations: response.data });
    } catch (error) {
        res.status(500).send("Erreur lors de la récupération des réservations.");
    }
});

// Détails de la réservation
router.get("/reservations/:id/:id2", async (req, res) => {
    try {
        const token = req.cookies.token; // Récupérer le token stocké
        if (!token) {
            return res.redirect("/login");
        }

        const { id, id2 } = req.params;
        const response = await axios.get(`http://localhost:8000/api/catways/${id}/reservations/${id2}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        res.render("reservationDetails", { reservation: response.data });
    } catch (error) {
        res.status(500).send("Erreur lors de la récupération des réservations.");
    }
});

// Documentation
router.get("/documentation", (req, res) => {
    res.render("documentation", { title: "Documentation API" });
});

module.exports = router;
