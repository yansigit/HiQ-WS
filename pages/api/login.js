import {generateAccessToken, generateRefreshToken} from "../../lib/token";
import Cookies from 'cookies'

const mockUp = [
    {
        id: "test",
        password: "test",
        info: "secret"
    }
]

export default async function handler(req, res) {
    const {id, password} = JSON.parse(req.body)
    const cookies = new Cookies(req, res)

    if (mockUp.find(e => e.id === id && e.password === password)) {
        cookies.set("accessToken", generateAccessToken(), {
            httpOnly: true,
            sameSite: "strict"
        })
        cookies.set("refreshToken", generateRefreshToken(), {
            httpOnly: true,
            sameSite: "strict"
        })
        res.status(200).json({ success: true })
        return
    }

    res.status(400).json({ error : "No User" })
}