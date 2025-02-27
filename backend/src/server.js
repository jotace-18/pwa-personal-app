import express from "express";

const app = express();
const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("¡Servidor backend funcionando!");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo a tope en http://localhost:${PORT}`);
});
