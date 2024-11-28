const Reservation = require("../models/Reservation");

// Obtenir toutes les réservations
exports.getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find();
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération de toutes les réservations", error });
    }
};

// Obtenir toutes les réservations pour un catway spécifique
exports.getAllReservationsForCatway = async (req, res) => {
    try {
        const catwayNumber = req.params.id;
        const reservations = await Reservation.find({ catwayNumber });

        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des réservations", error });
    }
};

// Obtenir une réservation spécifique par ID de catway et de réservation
exports.getReservationById = async (req, res) => {
    try {
        const { id, idReservation } = req.params;

        const reservation = await Reservation.findOne({
            catwayNumber: id,
            _id: idReservation
        });

        if (!reservation) {
            return res.status(404).json({ message: "Réservation non trouvée" });
        }

        res.status(200).json(reservation);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération de la réservation", error });
    }
};

// Créer une réservation pour un catway spécifique
exports.createReservation = async (req, res) => {
    try {
        const catwayNumber = req.params.id;

        const newReservation = new Reservation({
            ...req.body,
            catwayNumber,
        });

        await newReservation.save();

        res.status(201).json(newReservation);
    } catch (error) {
        console.error("Erreur lors de la création de la réservation :", error.message);
        res.status(400).json({ message: "Erreur lors de la création de la réservation", error });
    }
};

// Supprimer une réservation par ID de catway et de réservation
exports.deleteReservation = async (req, res) => {
    try {
        const { id, idReservation } = req.params;

        const deletedReservation = await Reservation.findOneAndDelete({
            catwayNumber: id,
            _id: idReservation,
        });

        if (!deletedReservation) {
            return res.status(404).json({ message: "Réservation non trouvée" });
        }

        res.status(200).json({ message: "Réservation supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de la réservation", error });
    }
};

