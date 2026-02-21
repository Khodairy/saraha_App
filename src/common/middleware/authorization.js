export const authorization = (roles = []) => {
  return async (req, res, next) => {
    console.log(roles.includes(req.user.role));
    console.log(roles, req.user.role);

    if (!roles.includes(req.user.role)) {
      throw new Error("UnAuthrorized");
    }
    next();
  };
};
