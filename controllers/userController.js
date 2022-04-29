const ApiError = require("../error/apiError")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User, Basket } = require("../models/models")


const JwtGenerate = (id, email, role) => {
  return jwt.sign(
    { id, email, role },
    process.env.SECRET_KEY,
    { expiresIn: '24h' }
  )
};
class userController {

  async registration(req, res, next) {

    try {

      const { email, password, role } = req.body

      if (!email || !password) {
        return next(ApiError.badRequest('email and password are required'))
      }

      const exsistUser = await User.findOne({ where: { email } })
      if (exsistUser) {
        return next(ApiError.badRequest('User with this email already exist'))
      }

      const HashedPassword = await bcrypt.hash(password, 6)
      const user = await User.create({ email, password: HashedPassword, role })
      const basket = await Basket.create({ userId: user.id })
      const token = JwtGenerate(user.id, user.email, user.role)

      return res.json({ token })


    } catch (error) {
      next(error);
    }

  }

  async login(req, res, next) {

    const { email, password } = req.body

    if (!email || !password) {
      return next(ApiError.badRequest('email and password are required'))
    }
    const UserFind = await User.findOne({ where: { email } })

    if (!UserFind) {
      return next(ApiError.unauthorized('User with this email not exist, Please register'))
    }
    const isPasswordCorrect = bcrypt.compareSync(password, UserFind.password)

    if (!isPasswordCorrect) {
      return next(ApiError.unauthorized('Password is incorrect'))
    }
    const token = JwtGenerate(UserFind.id, UserFind.email, UserFind.role)
    return res.json({ token })

  }
  async check(req, res, next) {
    res.json({ message: "Token generate... Status: OK ", token })
  }

};



module.exports = new userController();