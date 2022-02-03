import jwt from "jsonwebtoken";

const secretkey = "d7d34917fbd11fdd89357decfb506b5e563e418bf7b136d30436dfa0dddbd4a6e318099c8e4918b87fd8e47e23196c441a5c892a6895d6061e27f89ed1ba19d6"

export function generateAccessToken(user) {
    return jwt.sign(user, secretkey, {
        expiresIn: "30s"
    })
}

export function generateRefreshToken(user) {
    return jwt.sign(user, secretkey, {
        expiresIn: "180 days"
    })
}

export function refreshAccessToken(token) {
    const result = jwt.verify(token, secretkey, null, (err, decoded) => {
        if (err)
            return err
        return decoded
    });

    // When verification failed
    if (!result.EMAIL) {
        return result
    }

    delete result.iat
    delete result.exp

    return generateAccessToken(result)
}

export function getUserFromToken(token) {
    return jwt.verify(token, secretkey, null, (err, decoded) => {
        if (err)
            return err
        return decoded
    });
}


/**
 * @param {*} accessToken
 * @param {*} refreshToken
 * @param {Cookies} cookies
 * @return {Object} user
 */
export function tokenMiddleWare(accessToken, refreshToken, cookies) {
    const user = getUserFromToken(accessToken)

    // If already expired
    if (user.hasOwnProperty("expiredAt")) {
        accessToken = refreshAccessToken(refreshToken)
        // Refresh token
        cookies.set("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "strict"
        })
    }

    return accessToken
}