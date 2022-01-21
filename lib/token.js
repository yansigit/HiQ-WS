import jwt from "jsonwebtoken";

export function generateAccessToken(id) {
    return jwt.sign({id}, 'asd', {
        expiresIn: "15m"
    })
}

export function generateRefreshToken(id) {
    return jwt.sign({id}, 'asd', {
        expiresIn: "180 days"
    })
}