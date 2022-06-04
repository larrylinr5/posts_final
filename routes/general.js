const express = require("express");
const router = express.Router();
const { appError } = require("../utils/errorHandler");

router.get("*", (req, res, next) => {
/**
  * #swagger.tags = ['NotFound']
  * #swagger.summary = '404 路由'
  */
  /**
  #swagger.responses[404] = {
    description: '無此路由',
    schema: { $ref: '#/definitions/Error' }
  }
  */
  return next(appError(404, "40401", "Invalid Route"));
});

module.exports = router;