const {validationResult, checkSchema} = require('express-validator');

function validateSchema(schema) {
  const validationMiddleware = checkSchema(schema);
  return async (req, res, next) => {

    // const extraFields = checkIfExtraFields(validationMiddleware, req)
    // if (extraFields) {
    //   const error = Error("Request should not contain additional fields");
    //   error.statusCode = 400;
    //   next(error);
    //   return;
    // }

    await validationMiddleware.run(req);
    const result = validationResult(req);
    if (result.isEmpty()) {
      next();
      return;
    }
    const error = Error(result.array().map(value => value.msg).join());
    error.statusCode = 400;
    next(error);
  };
}
const createTodoSchema = {
  text: {
    isString: {
      errorMessage: "Todo text should be a string"
    },
    isLength: {
      errorMessage: 'Todo text should be at least 1 characters long',
      options: { min: 1 },
    },
    in: ['body']
  }
};

const updateTodoSchema = {
  text: {
    isString: {
      errorMessage: "Todo text should be a string"
    },
    isLength: {
      errorMessage: 'Todo text should be at least 1 characters long',
      options: { min: 1 },
    },
    in: ['body']
  },
  isNew: {
    isBoolean: {
      errorMessage: 'isNew must be boolean'
    },
    in: ['body']
  },
  status: {
    isBoolean: {
      errorMessage: 'status must be boolean'
    },
    in: ['body']
  }
};

// https://stackoverflow.com/questions/58938169/express-validator-fail-on-unknown-key
function checkIfExtraFields (validators, req) {
  const allowedFields = validators.reduce((fields, rule) => {
    return [...fields, ...rule.builder.fields]
  }, []).sort()

  const requestInput = { ...req.body }
  const requestFields = Object.keys(requestInput).sort()

  if (JSON.stringify(allowedFields) === JSON.stringify(requestFields)) {
    return false
  }
  return true
}

module.exports = {
  validateSchema,
  createTodoSchema,
  updateTodoSchema
};
