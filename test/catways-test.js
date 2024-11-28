const assert = require("assert");
const supertest = require("supertest");
const app = require("../server");
const Catway = require("../models/Catway");

const request = supertest(app);

describe("Tests de gestion des Catways", () => {
    let sharedCatway;

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

    it("Devrait retourner tous les catways", async () => {
        const response = await request.get("/api/catways");

        assert.strictEqual(response.status, 200);
        assert(Array.isArray(response.body)); // Vérifie que le corps est un tableau
    });

    it("Devrait créer un nouveau catway", async () => {
        const newCatwayData = {
            catwayNumber: 2000,
            type: "long",
            catwayState: "Disponible",
        };

        const response = await request.post("/api/catways").send(newCatwayData);

        assert.strictEqual(response.status, 201); // Vérifie le statut
        assert.strictEqual(response.body.catwayNumber, 2000); // Vérifie que le catway créé a le bon numéro

        // Nettoyage du catway créé pour ce test
        await Catway.findByIdAndDelete(response.body._id);
    });

    it("Devrait supprimer un catway existant", async () => {
        // Crée un nouveau Catway spécifique à ce test
        const testCatway = await Catway.create({
            catwayNumber: 3000,
            type: "short",
            catwayState: "Occupé",
        });

        const response = await request.delete(`/api/catways/${testCatway._id}`);

        assert.strictEqual(response.status, 200); // Vérifie le statut
        assert.strictEqual(response.body.message, "Catway supprimé avec succès");

        // Vérifie que le catway est bien supprimé
        const deletedCatway = await Catway.findById(testCatway._id);
        assert.strictEqual(deletedCatway, null);
    });

    it("Devrait modifier un catway existant", async () => {
        const updatedData = {
            catwayNumber: 4000,
            type: "long",
            catwayState: "Indisponible",
        };

        const response = await request
            .put(`/api/catways/${sharedCatway._id}`)
            .send(updatedData);

        assert.strictEqual(response.status, 200); // Vérifie le statut
        assert.strictEqual(response.body.catwayNumber, 4000); // Vérifie la mise à jour
        assert.strictEqual(response.body.type, "long");
        assert.strictEqual(response.body.catwayState, "Indisponible");

        // Restaure l'état initial du Catway partagé pour ne pas affecter les autres tests
        await Catway.findByIdAndUpdate(sharedCatway._id, {
            catwayNumber: 1000,
            type: "short",
            catwayState: "Disponible",
        });
    });
});
