const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const ROBLOSECURITY = process.env.ROBLOSECURITY;

// Durchsucht alle Seiten der Follower-Liste ob "followerId" dem "creatorId" folgt
async function isFollowing(followerId, creatorId) {
    followerId = String(followerId);
    let cursor = "";

    while (true) {
        const url = `https://friends.roblox.com/v1/users/${creatorId}/followers?limit=100&sortOrder=Asc${cursor ? `&cursor=${cursor}` : ""}`;

        const response = await fetch(url, {
            headers: { "Cookie": `.ROBLOSECURITY=${ROBLOSECURITY}` }
        });
        const data = await response.json();

        if (!data.data) {
            console.log("Kein data Feld:", JSON.stringify(data));
            return false;
        }

        // Prüfen ob followerId auf dieser Seite ist
        const found = data.data.some(user => String(user.id) === followerId);
        if (found) return true;

        // Nächste Seite - falls keine mehr, abbrechen
        if (!data.nextPageCursor) return false;
        cursor = data.nextPageCursor;
    }
}

app.get("/follows", async (req, res) => {
    const { from, to } = req.query;
    if (!from || !to) return res.status(400).json({ error: "from und to fehlen" });

    try {
        const result = await isFollowing(from, to);
        res.json({ isFollowing: result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => console.log(`Proxy läuft auf Port ${PORT}`));
