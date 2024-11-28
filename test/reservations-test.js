const assert = require("assert");
const supertest = require("supertest");
const app = require("../server");
const Catway = require("../models/Catway");
const Reservation = require("../models/Reservation");

const request = supertest(app);

describe("Tests de gestion des réservations pour un Catway", () => {
    let sharedCatway;
    let createdReservation;

    before(async () => {
        // Crée un Catway unique partagé entre les tests
        sharedCatway = await Catway.create({
            catwayNumber: 1000, 
            type: "short",
            catwayState: "Disponible",
        });
    });

    after(async () => {
        // Supprime le Catway partagé après tous les tests
        if (sharedCatway) {
            await Catway.findByIdAndDelete(sharedCatway._id);
        }
    });

    afterEach(async () => {
        // Nettoyage après chaque test (réservations uniquement)
        if (createdReservation) {
            await Reservation.findByIdAndDelete(createdReservation._id);
        }
        createdReservation = null;
    });

    it("Devrait créer une réservation pour le Catway partagé", async () => {
        const newReservation = {
            catwayNumber: sharedCatway.catwayNumber,
            clientName: "John Doe",
            boatName: "BOAT",
            checkIn: "2024-10-25",
            checkOut: "2024-11-30",
        };

        const response = await request
            .post(`/api/catways/${sharedCatway.catwayNumber}/reservations`)
            .send(newReservation);

        assert.strictEqual(response.status, 201); // Vérifie le statut
        assert.strictEqual(response.body.catwayNumber, sharedCatway.catwayNumber);
        assert.strictEqual(response.body.clientName, "John Doe"); // Vérifie les détails
        createdReservation = response.body; // Stocke la réservation créée pour nettoyage
    });

    it("Devrait retourner toutes les réservations pour le Catway partagé", async () => {
        // Ajoute une réservation pour ce test
        createdReservation = await Reservation.create({
            catwayNumber: sharedCatway.catwayNumber,
            clientName: "John Doe",
            boatName: "BOAT",
            checkIn: "2024-10-25",
            checkOut: "2024-11-30",
        });

        const response = await request.get(`/api/catways/${sharedCatway.catwayNumber}/reservations`);

        assert.strictEqual(response.status, 200); // Vérifie que le statut est 200
        assert(Array.isArray(response.body), "La réponse devrait être un tableau");
        assert.strictEqual(response.body.length > 0, true, "Le tableau des réservations ne doit pas être vide");
        assert.strictEqual(response.body[0].catwayNumber, sharedCatway.catwayNumber);
    });

    it("Devrait retourner une réservation spécifique", async () => {
        // Ajoute une réservation pour ce test
        createdReservation = await Reservation.create({
            catwayNumber: sharedCatway.catwayNumber,
            clientName: "John Smith",
            boatName: "BOAT",
            checkIn: "2024-10-25",
            checkOut: "2024-11-30",
        });

        const response = await request.get(`/api/catways/${sharedCatway.catwayNumber}/reservations/${createdReservation._id}`);

        assert.strictEqual(response.status, 200); // Vérifie le statut
        assert.strictEqual(response.body.catwayNumber, sharedCatway.catwayNumber); // Vérifie les détails
    });

    it("Devrait supprimer une réservation existante", async () => {
        // Ajoute une réservation pour ce test
        createdReservation = await Reservation.create({
            catwayNumber: sharedCatway.catwayNumber,
            clientName: "Alice Johnson",
            boatName: "BOAT",
            checkIn: "2024-10-25",
            checkOut: "2024-11-30",
        });

        const response = await request.delete(`/api/catways/${sharedCatway.catwayNumber}/reservations/${createdReservation._id}`);

        assert.strictEqual(response.status, 200); // Vérifie le statut
        assert.strictEqual(response.body.message, "Réservation supprimée avec succès");
    });
});
