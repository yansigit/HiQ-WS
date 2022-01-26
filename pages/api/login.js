import {generateAccessToken, generateRefreshToken} from "../../lib/token";
import Cookies from 'cookies'
import DBConnector from "../../lib/db";

export default async function handler(req, res) {
    const {email, password} = JSON.parse(req.body)
    const cookies = new Cookies(req, res)

    const user = await DBConnector.getInstance.table('USERS')
        .where('EMAIL', email)
        .where('PASSWORD', password)
        .leftJoin('SHIPS', 'USERS.EMAIL', 'SHIPS.OWNER')
        .select().then(e => {
            return ({
                EMAIL: e[0].EMAIL,
                PASSWORD: e[0].PASSWORD,
                ROLE: e[0].ROLE,
                SHIPS: e.reduce((prev, {NAME, HULLNUM}) => {
                    prev.push({NAME, HULLNUM});
                    return prev
                }, [])
            });
        })

    if (!user) {
        res.status(400).json({error: "LOGIN FAILED"})
        return
    }

    cookies.set("accessToken", generateAccessToken(user), {
        httpOnly: true,
        sameSite: "strict"
    })
    cookies.set("refreshToken", generateRefreshToken(user), {
        httpOnly: true,
        sameSite: "strict"
    })

    res.status(200).json({success: true})
}