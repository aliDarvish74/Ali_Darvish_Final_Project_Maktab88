const express = require("express");
const router = express.Router();

const apiRouter = require("./api-route");
const viewsRouter = require("./views-route");

router.use("/api", apiRouter);
router.use("/", viewsRouter);

module.exports = router;
