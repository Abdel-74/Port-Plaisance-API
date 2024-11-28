// Middleware pour simuler un utilisateur authentifié en environnement de test
module.exports = function mockAuth(req, res, next) {
    req.user = {
        email: "alice@example.com",
        password: "123",
    };
    next();

};
