const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const ROBLOSECURITY = process.env.ROBLOSECURITY; // als Env Variable in Render setzen

app.get("/follows", async (req, res) => {
    const { from, to } = req.query;
    if (!from || !to) return res.status(400).json({ error: "from und to fehlen" });

    try {
        const url = `https://friends.roblox.com/v1/users/${from}/follows?targetUserId=${to}`;
        const response = await fetch(url, {
            headers: {
                "Cookie": `.ROBLOSECURITY=${ROBLOSECURITY}`
            }
        });
        const data = await response.json();
        console.log("Raw:", JSON.stringify(data));
        res.json({ isFollowing: data.isFollowing ?? false, raw: data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => console.log(`Proxy läuft auf Port ${PORT}`));
