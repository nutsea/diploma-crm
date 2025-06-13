import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

import './Header.scss'
import './Menu.scss'

import logo from '../../assets/logo.png'
import arr1 from '../../assets/arr1.svg'
import burger from '../../assets/burger.svg'
import profile from '../../assets/profile.png'

import close from '../../assets/close.svg'
import signOut from '../../assets/signOut.svg'
import { checkAuth, checkAuthBrowser, createAuth } from "../../http/authAPI"
import { checkUser } from "../../http/userAPI"
import { fetchByIds, fetchCartItems } from "../../http/itemAPI";
import { findUserFav } from "../../http/favAPI";
import { findUserCart } from "../../http/cartAPI";
import { observer } from "mobx-react-lite";
import { Context } from "../..";

export const Header = observer(({ authcode }) => {
    const { user_fav, user_cart, user_store } = useContext(Context)
    const [isAuth, setIsAuth] = useState(false)
    const [user, setUser] = useState({})

    const location = useLocation()
    const navigate = useNavigate()

    const handleNavigate = (e) => {
        handleMenuClose()
        navigate(e.target.id)
        window.scrollTo({
            top: 0,
        })
    }

    const handleBurger = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
        document.querySelector('.App').classList.add('Lock')

        const menu = document.querySelector('.MenuContainer')
        const menuBox = document.querySelector('.MenuBox')
        menuBox.classList.toggle('None')
        setTimeout(() => {
            menu.classList.toggle('MenuHide')
            menuBox.classList.toggle('MenuBoxHide')
        }, 1);
    }

    const handleMenuClose = () => {
        document.querySelector('.App').classList.remove('Lock')

        const menu = document.querySelector('.MenuContainer')
        menu.classList.add('MenuHide')
        const menuBox = document.querySelector('.MenuBox')
        menuBox.classList.add('MenuBoxHide')
        menuBox.scrollTo(0, 0)
        setTimeout(() => {
            menuBox.classList.add('None')
        }, 200);
    }

    const clickMenuAway = (e) => {
        if (!e.target.closest('.MenuContainer') && !e.target.closest('.BurgerBtn')) {
            handleMenuClose()
        }
    }

    const formatePhone = (phone) => {
        return `+${phone.slice(0, 1)} (${phone.slice(1, 4)}) ${phone.slice(4, 7)}-${phone.slice(7, 9)}-${phone.slice(9, 11)}`
    }

    const handleAuth = async () => {
        await createAuth().then(data => {
            // const telegramUrl = `https://t.me/nutsea_web_bot?start=${data.code}`
            // const telegramUrl = `https://t.me/wp_auth_bot?start=${data.code}`
            const telegramUrl = `https://t.me/kicksie_bot?start=${data.code}`

            setTimeout(() => {
                let newWindow = window.open(telegramUrl, '_blank')

                if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                    window.location.href = telegramUrl
                }
            }, 10)

            const authenticate = setInterval(async () => {
                await checkAuthBrowser(data.code).then(data2 => {
                    if (data2) {
                        checkToken().then(() => {
                            clearInterval(authenticate)
                        })
                    }
                })
            }, 1000)
        })
    }

    const checkToken = async () => {
        try {
            await checkUser().then(data => {
                setUser(data.user)
                // user_store.setUser(data.user)
            })
            setIsAuth(true)
        } catch (e) {

        }
    }

    const logOut = async () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setIsAuth(false)
        setUser({})
        if (location.pathname === '/profile') {
            navigate('/')
        }
        window.location.reload()
    }

    const authenticate = async (authcode) => {
        try {
            await checkAuth(authcode).then(data => {
                setUser(data.user)
            })
            setIsAuth(true)
        } catch (e) {

        }
    }

    const checkUserId = async () => {
        try {
            await findUserFav(user.id).then(async (data2) => {
                await fetchByIds(data2.map(item => item.item_uid)).then(data3 => {
                    user_fav.setFav(data3)
                })
            })
            await findUserCart(user.id).then(async data2 => {
                user_cart.setCart(data2)
            })
        } catch (e) {
            const wishArr = JSON.parse(localStorage.getItem('wish'))
            if (wishArr && Array.isArray(wishArr)) {
                await fetchByIds(wishArr).then(data => {
                    user_fav.setFav(data)
                })
            }
            await fetchCartItems(JSON.parse(localStorage.getItem('cart'))).then(data => {
                user_cart.setCart(data)
            })
        }
    }

    useEffect(() => {
        checkToken()
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (authcode) authenticate(authcode)
    }, [authcode])

    useEffect(() => {
        checkUserId()
        // eslint-disable-next-line
    }, [user])

    useEffect(() => {
        if (user_store.user) {
            checkToken()
        }
        // eslint-disable-next-line
    }, [user_store.user])

    return (
        <>
            <header className='Header'>
                <div className="HeaderPC">
                    <div className='HeaderTop'>
                        <img className='HeaderLogo' src={logo} alt="WearPoizon" id="/" onClick={handleNavigate} />
                        {!isAuth ?
                            <div className='HeaderAuth' onClick={handleAuth}>
                                <span>Вход</span>
                                <img src={arr1} alt="Вход" />
                            </div>
                            :
                            <div className="HProfileInitials" id="/profile" onClick={handleNavigate}>
                                {(!user || (!user.name && !user.surname)) &&
                                    <img src={profile} id="/profile" alt="" />
                                }
                                {user && user.name &&
                                    <span id="/profile">{user.name[0]}</span>
                                }
                                {user && user.surname &&
                                    <span id="/profile">{user.surname[0]}</span>
                                }
                            </div>
                        }
                    </div>
                </div>
                <div className="HeaderMobile">
                    <div className="BurgerBtn" onClick={handleBurger}>
                        <img src={burger} alt="Меню" />
                    </div>
                    <img className='HeaderLogo' src={logo} alt="WearPoizon" id="/" onClick={handleNavigate} />
                    <div className="HeaderElement"></div>
                </div>
            </header>
            <div className="MenuBox MenuBoxHide None" onClick={clickMenuAway}>
                <div className="MenuContainer MenuHide">
                    <div className="MenuTop">
                        <span></span>
                        <span>Меню</span>
                        <div className="MenuClose" onClick={handleMenuClose}>
                            <img src={close} alt="Закрыть" />
                        </div>
                    </div>
                    {isAuth ?
                        <div className="MenuProfile">
                            <div className="MProfileData">
                                <div className="MProfileInitials" id="/profile" onClick={handleNavigate}>
                                    {(!user || (!user.name && !user.surname)) &&
                                        <img src={profile} id="/profile" alt="" />
                                    }
                                    {user && user.name &&
                                        <span id="/profile">{user.name[0]}</span>
                                    }
                                    {user && user.surname &&
                                        <span id="/profile">{user.surname[0]}</span>
                                    }
                                </div>
                                <div className="MProfileNP">
                                    {user && user.name &&
                                        <div className="MProfileName">{user.name}</div>
                                    }
                                    {user && user.phone &&
                                        <div className="MProfilePhone">{formatePhone(user.phone)}</div>
                                    }
                                </div>
                            </div>
                            <div className="MenuCatalogue">
                                <div className="MenuItem2" id="/profile" onClick={handleNavigate}>
                                    <span id="/profile">Личные данные</span>
                                </div>
                                <div className="MenuLine" />
                                {(user.role === 'admin' || user.role === 'main' || user.role === 'dev') &&
                                    <>
                                        <div className="MenuItem2" id="/profile/?tab=settings" onClick={handleNavigate}>
                                            <span id="/profile/?tab=settings">Настройки профиля</span>
                                        </div>
                                        <div className="MenuLine" />
                                        <div className="MenuItem2" id="/?tab=api" onClick={handleNavigate}>
                                            <span id="/?tab=api">Poizon API</span>
                                        </div>
                                        <div className="MenuLine" />
                                        <div className="MenuItem2" id="/crm/?tab=items" onClick={handleNavigate}>
                                            <span id="/?tab=items">Управление товарами</span>
                                        </div>
                                        <div className="MenuLine" />
                                        <div className="MenuItem2" id="/crm/?tab=orders" onClick={handleNavigate}>
                                            <span id="/?tab=orders">Управление заказами</span>
                                        </div>
                                        <div className="MenuLine" />
                                        <div className="MenuItem2" id="/crm/?tab=users" onClick={handleNavigate}>
                                            <span id="/?tab=users">Управление клиентами</span>
                                        </div>
                                        {user.chat_id === '525881782' &&
                                            <>
                                                <div className="MenuLine" />
                                                <div className="MenuItem2" id="/crm/?tab=stories" onClick={handleNavigate}>
                                                    <span id="/?tab=stories">Управление сторис</span>
                                                </div>
                                            </>
                                        }
                                        <div className="MenuLine" />
                                        <div className="MenuItem2" id="/crm/?tab=settings" onClick={handleNavigate}>
                                            <span id="/?tab=settings">Настройки CRM</span>
                                        </div>
                                        <div className="MenuLine" />
                                    </>
                                }
                            </div>
                            <div className="MenuAuth" onClick={logOut}>
                                <img src={signOut} alt="Выйти" />
                                <span>Выйти из аккаунта</span>
                            </div>
                        </div>
                        :
                        <div className="MenuAuth" onClick={handleAuth}>Авторизация через Telegram</div>
                    }
                </div>
            </div >
        </>
    )
})