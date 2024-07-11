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

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
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