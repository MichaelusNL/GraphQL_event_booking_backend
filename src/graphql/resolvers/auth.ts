import { userModel } from '../../models/user'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import path from 'path'
require('dotenv').config({
  path: path.resolve(__dirname, '../.env'),
})

module.exports = {
  createUser: async (args: { userInput: { email: any; password: any } }) => {
    try {
      const existingUser = await userModel.findOne({
        email: args.userInput.email,
      })
      if (existingUser) {
        throw new Error('User exists already.')
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12)

      const user = new userModel({
        email: args.userInput.email,
        password: hashedPassword,
      })

      const result = await user.save()

      return { ...result._doc, password: null, _id: result.id }
    } catch (err) {
      throw err
    }
  },
  login: async ({ email, password }: { email: string; password: string }) => {
    const user = await userModel.findOne({ email: email })
    if (!user) {
      throw new Error('User does not exist!')
    }
    const isEqual = await bcrypt.compare(password, user.password)
    if (!isEqual) {
      throw new Error('Password is incorrect!')
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      `${process.env.JWT_KEY}`,
      {
        expiresIn: '1h',
      }
    )

    return { userId: user.id, token: token, tokenExpiration: 1 }
  },
}
