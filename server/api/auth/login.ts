import { User } from '~/server/models/User'
import type { IUser } from '~/server/models/User'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { email, password } = body

    try {
        const user = await User.findOne({ email }).select('+authentication.password') as IUser | null
        if (!user || !user.authentication) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Invalid email',
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.authentication.password)
        if (!isPasswordValid) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Invalid email or password',
            })
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
          throw new Error('JWT_SECRET is not set in environment variables');
        }
        
        const token = jwt.sign(
          { userId: user._id, email: user.email },
          jwtSecret,
          { expiresIn: '2m' } // cas
        );

        return {
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        }
    } catch (error) {
        console.error('Login error:', error)
        throw createError({
            statusCode: 401,
            statusMessage: error instanceof Error ? error.message : 'Login failed',
        })
    }
})