// ==================== create ====================
export const create = async ({ model, data } = {}) => {
  return await model.create(data);
};

// ==================== find One ====================
export const findOne = async ({ model, filter = {}, options = {} } = {}) => {
  const doc = model.findOne(filter);

  if (options.populate) {
    doc.populate(options.populate);
  }

  if (options.skip) {
    doc.skip(options.skip);
  }

  if (options.limit) {
    doc.limit(options.limit);
  }
  return await doc.exec();
};

// ==================== find ====================
export const find = async ({ model, filter = {}, options = {} } = {}) => {
  const doc = model.find(filter);

  if (options.populate) {
    doc.populate(options.populate);
  }

  if (options.skip) {
    doc.skip(options.skip);
  }

  if (options.limit) {
    doc.limit(options.limit);
  }
  return await doc.exec();
};

// ==================== update One ====================
export const updateOne = async ({
  model,
  filter = {},
  update,
  options = {},
} = {}) => {
  const doc = model.updateOne(filter, update, {
    runValidators: true,
    ...options,
  });

  return await doc.exec();
};

// ==================== findOne & update ====================
export const findOneAndUpdate = async ({
  model,
  filter = {},
  update,
  options = {},
} = {}) => {
  const doc = model.findOneAndUpdate(filter, update, {
    new: true,
    runValidators: true,
    ...options,
  });

  return await doc.exec();
};
