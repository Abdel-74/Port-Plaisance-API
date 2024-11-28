const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'] || `Bearer ${req.cookies.token}`;

    // Vérifiez si le header Authorization existe et contient "Bearer"
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: 'Token manquant ou mal formé' });
    }

    // Extraire le token après "Bearer "
    const token = authHeader.split(' ')[1];

    // Vérifier et décoder le token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token invalide' });
        }

        // Ajouter les informations de l'utilisateur décodées dans req.user
        req.user = decoded;
        next();
    });
}

module.exports = authMiddleware;
