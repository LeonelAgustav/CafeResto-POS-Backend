const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CafeResto POS API",
      version: "1.0.0",
      description: "Dokumentasi API CafeResto POS (Railway)",
    },

    servers: [
      {
        url: "https://caferesto-pos-backend-production.up.railway.app/api/v1",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    tags: [
      {
        name: "Auth",
        description: "Manajemen Autentikasi Staff & Admin",
      },
      {
        name: "Orders",
        description: "Manajemen Transaksi & Checkout",
      },
      {
        name: "Inventory",
        description: "Update Stok & Bahan Baku",
      },
      {
        name: "Menus",
        description: "Kelola Item Menu",
      },
      {
        name: "Payments",
        description: "Konfirmasi Pembayaran",
      },
    ],
  },

  // ⬇️ SESUAIKAN DENGAN STRUKTUR FOLDER KAMU
  apis: ["./routes/*.js"],
};

module.exports = swaggerJsdoc(options);
