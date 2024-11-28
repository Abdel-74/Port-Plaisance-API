const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Vérifiez si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Cet e-mail est déjà utilisé" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: "Utilisateur créé avec succès", user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur lors de l'inscription", error: err.message });
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Identifiants invalides" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Identifiants invalides" });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.cookie("token", token, { httpOnly: true }); // Stocker le token dans un cookie sécurisé
        res.redirect("/dashboard");
    } catch (error) {
        res.status(500).json({ message: "Erreur interne", error: error.message });
    }
};
