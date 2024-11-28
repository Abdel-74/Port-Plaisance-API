const express = require("express");
const router = express.Router();
const catwayController = require("../controllers/catwayController");
const reservationController = require("../controllers/reservationController");

const authMiddleware = require("../middleware/authMiddleware");
const isTestEnv = process.env.NODE_ENV === "test";

// Route pour toutes les réservations
router.get("/reservations", authMiddleware, reservationController.getAllReservations);

// Routes pour les catways
router.post("/", isTestEnv ? (req, res, next) => next() : authMiddleware, catwayController.createCatway);
router.get("/", isTestEnv ? (req, res, next) => next() : authMiddleware, catwayController.getAllCatways);
router.get("/:id", isTestEnv ? (req, res, next) => next() : authMiddleware, catwayController.getCatwayById);
router.put("/:id", isTestEnv ? (req, res, next) => next() : authMiddleware, catwayController.updateCatway);
router.delete("/:id", isTestEnv ? (req, res, next) => next() : authMiddleware, catwayController.deleteCatway);

// Routes pour les réservations (sous-ressource de Catway)
router.get("/:id/reservations", isTestEnv ? (req, res, next) => next() : authMiddleware, reservationController.getAllReservationsForCatway);
router.get("/:id/reservations/:idReservation", isTestEnv ? (req, res, next) => next() : authMiddleware, reservationController.getReservationById);
router.post("/:id/reservations", isTestEnv ? (req, res, next) => next() : authMiddleware, reservationController.createReservation);
router.delete("/:id/reservations/:idReservation", isTestEnv ? (req, res, next) => next() : authMiddleware, reservationController.deleteReservation);


module.exports = router;
