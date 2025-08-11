import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: {
    message: "Too many login attempts. Try again after some time...",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
