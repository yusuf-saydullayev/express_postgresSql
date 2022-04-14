const { Type } = require('../models/models');
const ApiError = require('../error/apiError');

class typeController {

  async create(req, res, next) {
    const { name } = req.body;
    if (name) {
      const exsist = await Type.findOne({ where: { name } })
      if (exsist) {
        return next(ApiError.badRequest(`${name} type already exist`));
      }
      const type = await Type.create({ name });
      res.json(type);
    }

    return next(ApiError.badRequest('name is required'));
  }


  async getAll(req, res, next) {

    try {
      const types = await Type.findAll();
      res.json(types);
      
    } catch (error) {
      next(ApiError.badRequest(error.message));

    }

  }

}



module.exports = new typeController;