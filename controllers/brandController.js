const { Brand } = require('../models/models');
const ApiError = require('../error/apiError');


class brandController {

  async create(req, res, next) {
    const { name } = req.body;

    if (name) {
      const exsist = await Brand.findOne({ where: { name } })
      if (exsist) {
        return next(ApiError.badRequest(`${name} brand already exist`));
      }
      const type = await Brand.create({ name });
      res.json(type);
    }
    return next(ApiError.badRequest('brand is required'));

  }


  async getAll(req, res, next) {

    try {
      const types = await Brand.findAll();
      res.json(types);

    } catch (error) {
      next(ApiError.badRequest(error.message));

    }

  }


}



module.exports = new brandController;