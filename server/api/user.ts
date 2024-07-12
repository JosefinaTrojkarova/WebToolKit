import { User } from '~/server/models/User'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
    const token = getRequestHeader(event, 'authorization')?.split(' ')[1]

    if (!token) {
        console.log('No token provided');
        throw createError({
            statusCode: 401,
            statusMessage: 'No token provided',
        })
    }

    try {
        const jwtSecret = process.env.JWT_SECRET
        if (!jwtSecret) {
            console.error('JWT_SECRET is not set in environment variables')
            throw createError({
                statusCode: 500,
                statusMessage: 'Server configuration error',
            })
        }

        let decoded;
        try {
            decoded = jwt.verify(token, jwtSecret) as { userId: string }
        } catch (jwtError) {
            console.error('JWT verification error:', jwtError)
            throw createError({
                statusCode: 401,
                statusMessage: 'Invalid token',
            })
        }

        const user = await User.findById(decoded.userId).select('-authentication')

        if (!user) {
            throw createError({
                statusCode: 404,
                statusMessage: 'User not found',
            })
        }

        return {
            user: {
                id: (user._id as string).toString(),
                username: user.username,
                email: user.email
            }
        }
    } catch (error) {
        console.error('Error fetching user:', error)
        if ((error as any).statusCode) {
            throw error // Re-throw createError errors
        }
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal server error',
        })
    }
})