const paginate = async (model, page, limit) => {
    const skip = (page - 1) * limit;
    const total = await model.countDocuments();
    const result = await model.find().skip(skip).limit(limit);
    return { total, result };
  };
  
  module.exports = { paginate };
  