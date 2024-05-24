const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

async function expressLoader(app) {
  app.use(logger("dev"));
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ limit: "10mb", extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, "public")));
  app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
  });

  app.use(
    cors({
      origin: [
        process.env.CLIENT_URL,
        process.env.EXTENSION_URL,
        process.env.SECOND_EXTENSION_URL,
        process.env.ACCESSIBLE_URL_G,
        process.env.ACCESSIBLE_URL_N,
        process.env.ACCESSIBLE_URL_D,
      ],
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true,
      preflightContinue: true,
      optionsSuccessStatus: 200,
    }),
  );
}

module.exports = expressLoader;
