import Cookies from "cookies";

export default async function handler(req, res) {
    const cookies = new Cookies(req, res)
    cookies.set('accessToken', null)
    cookies.set('refreshToken', null)
    res.status(200).json({success: true})
}