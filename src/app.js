require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const menuRoutes = require('./routes/menuRoutes');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// ============================
// API ROUTES
// ============================
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/inventory", inventoryRoutes);
app.use("/api/v1/menus", menuRoutes);

// ============================
// SWAGGER DOCS
// ============================
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

// ============================
// HEALTH CHECK
// ============================
app.get("/", (req, res) => {
  res.send("CafeResto POS API is running 🚀");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});