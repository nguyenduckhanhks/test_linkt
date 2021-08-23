import React, {useState} from 'react';
import {notification} from 'antd';
import { useRouter } from "next/router";
import authApi from '../../api/authApi';
import CookieService from '../../services/cookies';
import { useTranslation } from "next-i18next";
import Link from 'next/link'
import styles from './loginForm.module.scss';

const LoginForm = () => {
    const {t} = useTranslation();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onLogin = () => {
        authApi.loginApi({email, password}).then(res => {
            if(res.data.success) {
                const options = res.data.expires_at ? {path:'/', expires:(new Date(res.data.expires_at))} : {path:'/'}
                CookieService.set('access_token', res.data.access_token, options);
                CookieService.set('token_type', res.data.token_type, options);

                window.localStorage.setItem('userInfo', JSON.stringify(res.data.data))
            } else {
                notification['error']({
                    message: t('common:notification'),
                    description: res.data.message
                });
            }
            return res;
        }).then((res) => {
            if(res.data.success) {
                router.push('/setting');
                notification['success']({
                    message: t('common:notification'),
                    description: t('common:loginSuccess')
                });
            }
        }).catch(err => {
            notification['error']({
                message: t('common:notification'),
                description: "t('common:loginError')"
            });
            console.log(err)
        })
    }

    return (
        <div className={`${styles["login-form"]}`}>
            <div id="LoginForm">
                <div className={`${styles["login-form__row"]}`}>
                    <label className={`${styles["login-form__label"]}`}>{t('common:email')}</label>
                    <input 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        type="email" 
                        name="Email" 
                        className={`${styles["login-form__input"]}`}
                    />
                </div>
                <div className={`${styles["login-form__row"]}`}>
                    <label className={`${styles["login-form__label"]}`}>{t('common:password')}</label>
                    <input 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        type="password" 
                        name="password" 
                        className={`${styles["login-form__input"]}`}
                    />
                </div>
                <div className={`${styles["login-form__row"]}`}>
                    <input 
                        type="submit" 
                        name="submit" 
                        className={`${styles["login-form__submit"]}`}
                        id="submit" 
                        value={t('common:login').toString()}
                        onClick={() => onLogin()}
                    />
                </div>
            </div>
            {/* <div className="login-form__forgot-pass">
                <a href="forgot-password.html">
                    Forgot Password?
                </a>
            </div>		 */}
            <div className={`${styles["login-form__bottom"]}`}>
                <p>{t('common:dontHaveAccount')}</p>
                <Link href="/signup" >
                    <a className={`${styles["button-signup"]}`}>{t('common:signup')}</a>
                </Link>
            </div>
        </div>
    )
}

export default LoginForm;