const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");


router.post("/register", authController.register);
router.post("/login", authController.login);

// Mise à jour d'un utilisateur
router.put("/update", authMiddleware, async (req, res) => {
    try {
        const { id, name, email, password } = req.body;

        // Récupérer uniquement les champs non vides
        const updates = {};
        if (name) updates.name = name;
        if (email) updates.email = email;

        // Hashage du mot de passe s'il est fourni
        if (password) {
            const bcrypt = require("bcrypt");
            updates.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedUser) {
            return res.status(404).send("Utilisateur non trouvé");
        }

        res.redirect("/dashboard");
    } catch (error) {
        res.status(500).send("Erreur lors de la mise à jour de l'utilisateur.");
    }
});


// Suppression d'un utilisateur
router.delete("/delete", authMiddleware, async (req, res) => {
    try {
        const { id } = req.body; 
        const deletedUser = await User.findByIdAndDelete(id); 
        if (!deletedUser) {
            return res.status(404).send("Utilisateur non trouvé");
        }
        res.redirect("/dashboard");
    } catch (error) {
        res.status(500).send("Erreur lors de la suppression de l'utilisateur.");
    }
});



module.exports = router;
