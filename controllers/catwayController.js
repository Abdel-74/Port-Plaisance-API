const Catway = require("../models/Catway");
const mongoose = require('mongoose');


// Créer un nouveau catway
exports.createCatway = async (req, res) => {
    try {
        const newCatway = new Catway(req.body);
        await newCatway.save();
        res.status(201).json(newCatway);
    } catch (error) {
        res.status(400).json({ message: "Erreur lors de la création du catway", error });
    }
};

// Obtenir tous les catways
exports.getAllCatways = async (req, res) => {
    try {
        const catways = await Catway.find();
        res.status(200).json(catways);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des catways", error });
    }
};

// Obtenir un catway par ID
exports.getCatwayById = async (req, res) => {
    try {
        const catway = await Catway.findById(req.params.id);
        if (!catway) return res.status(404).json({ message: "Catway non trouvé" });
        res.status(200).json(catway);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du catway", error });
    }
};

// Mettre à jour un catway par ID
exports.updateCatway = async (req, res) => {
    try {
        const updatedCatway = await Catway.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCatway) return res.status(404).json({ message: "Catway non trouvé" });
        res.status(200).json(updatedCatway);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du catway", error });
    }
};

// Supprimer un catway par ID
exports.deleteCatway = async (req, res) => {
    try {
        const deletedCatway = await Catway.findByIdAndDelete(req.params.id);
        if (!deletedCatway) return res.status(404).json({ message: "Catway non trouvé" });
        res.status(200).json({ message: "Catway supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du catway", error });
    }
};