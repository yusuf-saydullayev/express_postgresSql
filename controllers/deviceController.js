const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { Device, DeviceInfo } = require('../models/models');
const ApiError = require('../error/apiError');

class deviceController {

  async create(req, res, next) {

    try {

      let { name, price, brandId, typeId, info } = req.body;
      const { img } = req.files;

      const fileName = uuidv4() + ".jpg";
      img.mv(path.resolve(__dirname, '..', 'static', fileName));

      const device = await Device.create({ name, price, brandId, typeId, img: fileName });

      if (info) {
        info = JSON.parse(info);
        info.forEach(async (item) => {
          await DeviceInfo.create({
            title: item.title,
            description: item.description,
            deviceId: device.id
          })
        })
      }



      return res.status(201).json(device);

    } catch (error) {
      next(ApiError.badRequest(error.message));

    }

  }

  async getAll(req, res, next) {

    try {
      let { brandId, typeId, limit, page } = req.query;

      // Limit and page
      page = page || 1;
      limit = limit || 10;
      let offset = page * limit - limit;

      let devices;

      if (brandId && typeId) {
        devices = await Device.findAndCountAll({ where: { brandId, typeId }, limit, offset });
        return res.json(devices);
      }

      if (!brandId && typeId) {
        devices = await Device.findAndCountAll({ where: { typeId }, limit, offset });
        return res.json(devices);
      }

      if (brandId && !typeId) {
        devices = await Device.findAndCountAll({ where: { brandId }, limit, offset });
        return res.json(devices);
      }

      devices = await Device.findAndCountAll({ limit, offset });
      return res.status(200).json(devices);

    } catch (error) {
      next(ApiError.badRequest(error.message));
    }


  }

  async getOne(req, res) {

    try {
      const { id } = req.params;

      const device = await Device.findOne({
        where: { id },
        include: [{ model: DeviceInfo, as: 'info' }]
      });

      return res.status(200).json(device);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }

  }
}




module.exports = new deviceController;