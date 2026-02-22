export const Validation = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      console.log(error);
      throw new Error(error.message);
    }
    next();
  };
};
