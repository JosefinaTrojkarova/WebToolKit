// server/api/auth/register.ts
import { User } from '~/server/models/User'
import bcrypt from 'bcrypt'

export default defineEventHandler(async (event) => {
  console.log('Register API route hit')
  const body = await readBody(event)
  const { username, email, password } = body

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] })
    if (existingUser) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User with this email or username already exists',
      })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
      username,
      email,
      authentication: {
        password: hashedPassword,
        salt: salt,
      },
    })

    await newUser.save()

    return { message: 'User registered successfully' }
  } catch (error) {
    console.error('Registration error:', error)
    throw createError({
      statusCode: 400,
      statusMessage: error instanceof Error ? error.message : 'Registration failed',
    })
  }
})