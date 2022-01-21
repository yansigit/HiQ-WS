import jwt from "jsonwebtoken";

const secretkey = "d7d34917fbd11fdd89357decfb506b5e563e418bf7b136d30436dfa0dddbd4a6e318099c8e4918b87fd8e47e23196c441a5c892a6895d6061e27f89ed1ba19d6"

export function generateAccessToken(id) {
    return jwt.sign({id}, secretkey, {
        expiresIn: "15m"
    })
}

export function generateRefreshToken(id) {
    return jwt.sign({id}, secretkey, {
        expiresIn: "180 days"
    })
}

export function refreshAccessToken(token) {
    const { id } = jwt.verify(token, secretkey)
    return generateAccessToken(id)
}