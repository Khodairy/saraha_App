export const Validation = (schema) => {
  return (req, res, next) => {
    const errorResult = [];

    const dataSources = {
      body: req.body,
      params: req.params,
      query: req.query,
      file: req.file,
      files: req.files,
    };

    for (let key of Object.keys(schema)) {
      const { error } = schema[key].validate(req[key], {
        abortEarly: false,
      });

      if (error) {
        error.details.forEach((err) => {
          errorResult.push({
            key,
            path: err.path[0],
            message: err.message,
          });
        });
      }
    }

    if (errorResult.length > 0) {
      return res.status(400).json({ message: errorResult });
    }

    next();
  };
};
