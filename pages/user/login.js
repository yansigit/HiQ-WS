import IconLogin from "../../public/icon_login.png"
import Image from "next/image";
import styles from "./login.module.css"
import {useEffect, useRef} from "react";
import {useRouter} from "next/router";
import {useForm} from "react-hook-form";
import {getUserFromToken, tokenMiddleWare} from "../../lib/token";
import Cookies from "cookies";
import vesselBg from "../../public/vessel3_blur.png"

export default function Login({LoggedIn, user}) {
    const [userEmail, userPW] = [useRef(), useRef()]
    const router = useRouter()
    const {handleSubmit} = useForm()

    useEffect(async () => {
        console.log(user)
        if (LoggedIn)
            if (user.ROLE === 'admin')
                await router.replace('/admin')
            else
                await router.replace("/")
    }, [])

    async function login(e) {
        const {success, error, ROLE} = await (await fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify({email: userEmail.current.value, password: userPW.current.value})
        })).json()

        if (success) {
            ROLE === 'admin' ? await router.replace("/admin") : await router.replace("/")
        } else {
            alert(error)
        }
    }

    return (
        <div className={`w-100 h-100 ${styles.loginPage}`} style={{backgroundImage: `url(${vesselBg.src})`}}>
            <div className={`h-100 d-flex align-content-center justify-content-center ${styles.layoutBody}`}>
                <div className="container align-self-center">
                    <header className="row justify-content-center p-3">
                        {/*<Image src={HWLogo} />*/}
                    </header>
                    <main className="row bg-white">
                        {/* Image */}
                        <section className={`col p-0 ${styles.image_section}`}>
                        </section>
                        {/* Login Form */}
                        <form onSubmit={handleSubmit(login)} className="col p-5 d-flex flex-column justify-content-center">
                            <div className={`${styles.typelogo} row justify-content-center align-items-center`}>
                                <Image src={IconLogin}/>
                            </div>
                            <div className="input-group">
                                <input type="text" name="userEmail" placeholder="Email" className="rounded-0 w-100 m-1 border p-1" ref={userEmail}/>
                                <input type="password" name="userPW" placeholder="Password" className="rounded-0 w-100 m-1 border p-1" ref={userPW}/>
                                <button className="btn btn-danger text-white rounded-0 w-100 m-1">Login</button>
                            </div>
                        </form>
                    </main>
                    <footer className="row justify-content-center p-3 bg-dark text-white text-center">
                        <small>Copyright © 2022. HYUNDAI WELDING Ltd. All rights Reserved.</small>
                    </footer>
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps({req, res}) {

    const {cookies: {accessToken, refreshToken}} = req

    // Redirect to dashboard page if the user already logged in
    if (accessToken) {
        const cookies = new Cookies(req, res)
        const accessToken = tokenMiddleWare(accessToken, refreshToken, cookies)
        const user = getUserFromToken(accessToken)
        return {props: {LoggedIn: true, user}}
    }

    return {props: {}}
}
