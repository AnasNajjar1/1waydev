const express = require("express");
const axios = require("axios");

const app = express();

app.get("/cities", async (req, res) => {
  const { zipcode } = req.query;

  if (!zipcode || typeof zipcode !== "string") {
    return res
      .status(400)
      .json({ success: false, error: "Le code postal est invalide." });
  }

  try {
    const response = await axios.get(
      `https://geo.api.gouv.fr/communes?codePostal=${zipcode}`
    );
    const cities = response.data.map((city) => city.nom);

    return res.json({ success: true, cities });
  } catch (error) {
    if (error.response) {
      return res
        .status(error.response.status)
        .json({
          success: false,
          error: "Erreur lors de la récupération des données.",
        });
    } else if (error.request) {
      return res.status(500).json({
        success: false,
        error: "Erreur lors de la connexion à l'API externe.",
      });
    } else {
      return res
        .status(500)
        .json({ success: false, error: "Une erreur inattendue est survenue!" });
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
