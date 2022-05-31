const express = require("express");
const router = express.Router();
const { appError } = require("../utils/errorHandler");

router.get("*", (req, res, next) => {
  /**
    *  #swagger.tags = ['Generals']
    */
  next(appError(404, "40401", "Invalid Route"));
});

module.exports = router;