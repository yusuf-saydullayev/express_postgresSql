const  Router  = require('express');
const router = new Router();

const userRouter = require('./UserRouter');
const deviceRouter = require('./DeviceRouter');
const brandRouter = require('./BrandRouter');
const typeRouter = require('./TypeRouter');


router.use('/user', userRouter);
router.use('/device', deviceRouter);
router.use('/brand', brandRouter);
router.use('/type', typeRouter);



module.exports = router;