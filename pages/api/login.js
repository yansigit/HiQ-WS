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
            if (!e.length) {
                return
            }
            const {COMPANY, EMAIL, NAME, ROLE, POSITION} = e[0]
            return ({
                COMPANY, EMAIL, NAME, ROLE, POSITION,
                SHIPS: e.reduce((prev, {SHIPNAME, HULLNUM}) => {
                    prev.push({SHIPNAME, HULLNUM});
                    return prev
                }, [])
            });
        })

    if (!user) {
        res.status(400).json({error: "Invalid login information. Please check your email and password again."})
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

    res.status(200).json({success: true, ROLE: user.ROLE})
}