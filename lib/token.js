import jwt from "jsonwebtoken";

const secretkey = "d7d34917fbd11fdd89357decfb506b5e563e418bf7b136d30436dfa0dddbd4a6e318099c8e4918b87fd8e47e23196c441a5c892a6895d6061e27f89ed1ba19d6"

const mockUpUser = {
    company: "Hyundai Welding",
    name: "Kim Kim",
    email: "email@gmail.com",
    position: "Programmer",
    ships: [{name: "1"}, {name: "2"}, {name: "3"}]
}

export function generateAccessToken(user) {
    return jwt.sign(mockUpUser, secretkey, {
        expiresIn: "30s"
    })
}

export function generateRefreshToken(email) {
    return jwt.sign({email: mockUpUser.email}, secretkey, {
        expiresIn: "180 days"
    })
}

export function refreshAccessToken(token) {
    const { email } = jwt.verify(token, secretkey)
    return generateAccessToken(email)
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
    // 유저 정보 얻어오기
    const user = getUserFromToken(accessToken)
    console.log(user.name)

    // 이미 만료된 상태라면
    if (user.hasOwnProperty("expiredAt")) {
        accessToken = refreshAccessToken(refreshToken)
        // 토큰 갱신
        cookies.set("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "strict"
        })
        console.log("액세스 토큰 만료되어 갱신하였습니다")
    }

    return accessToken
}