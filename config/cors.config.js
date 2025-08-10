import cors from "cors";

// Allowed origins for restricted routes
export const allowedOrigins = [
  "https://alumni-gbu.vercel.app/",
  "http://localhost:5173",
  "https://test.payu.in/_payment",
];

// Public CORS (open to all origins)
export const publicCors = cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Authorization", "Content-Type", "x-access-token"],
});

// Restricted CORS (only allowed origins)
export const restrictedCors = cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Authorization", "Content-Type", "x-access-token"],
});
