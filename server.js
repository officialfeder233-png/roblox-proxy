const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/follows", async (req, res) => {
    const { from, to } = req.query;

    if (!from || !to) {
        return res.status(400).json({ error: "Parameter 'from' und 'to' fehlen" });
    }

    try {
        const url = `https://friends.roblox.com/v1/users/${from}/follows?targetUserId=${to}`;
        const response = await fetch(url);
        const data = await response.json();

        // Rohe Antwort zurückgeben zum debuggen
        res.json({ raw: data, isFollowing: data.isFollowing ?? false });

    } catch (err) {
        res.status(500).json({ error: "Fehler beim Abrufen", details: err.message });
    }
});

// Zeigt die Follower-Liste eines Users
app.get("/followers", async (req, res) => {
    const { userId } = req.query;
    try {
        const url = `https://friends.roblox.com/v1/users/${userId}/followers?limit=100`;
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => console.log(`Proxy läuft auf Port ${PORT}`));
