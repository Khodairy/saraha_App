export const Validation = (schema) => {
  return (req, res, next) => {
    const errorResult = [];
    for (let key of Object.keys(schema)) {
      const { error } = schema[key].validate(req[key], {
        abortEarly: false,
      });

      if (error) {
        console.log(error);
        errorResult.push(error.message);
        // throw new Error(error.message);
      }
    }
    if (errorResult.length > 0) {
      res.status(400).json({ message: errorResult });
    }
    next();
  };
};
