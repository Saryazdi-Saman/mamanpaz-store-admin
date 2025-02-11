import jwt, { JwtPayload } from 'jsonwebtoken';

/**
 * Validates and decodes a JWT token against the provided secret.
 * 
 * @param token - The JWT token to be validated and decoded.
 * @returns The decoded payload if valid, or null if the token is invalid.
 */
export function validateAndDecodeJWT(token: string): JwtPayload | null {

    const secret = process.env.JWT_SECRET
    if (!secret) {
        throw new Error("JWT_SECRET is not defined in the environment variables.");
    }

    try {
        // The verify method both validates and decodes the token.
        const decoded = jwt.verify(token, secret);

        // jwt.verify returns either a string or an object.
        // If you expect an object (payload), you can check its type.
        if (typeof decoded === 'object' && decoded !== null) {
            return decoded as JwtPayload;
        }

        // If decoded is not an object, return null (or handle as needed)
        return null;
    } catch (error) {
        // Handle error (e.g., token is expired, invalid, etc.)
        console.error('Token validation failed:', error);
        return null;
    }
}