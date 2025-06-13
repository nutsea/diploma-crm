import React, { useContext, useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import './CRM.scss';
import { checkUser, login } from "../../http/userAPI";
import { Items } from "../../components/crmComponents/items/Items";
import queryString from "query-string";
import { Settings } from "../../components/crmComponents/settings/Settings";
import { PoizonParse } from "../../components/crmComponents/poizonParse/PoizonParse";
import { Orders } from "../../components/crmComponents/orders/Orders";
import { Users } from "../../components/crmComponents/users/Users";
import { Context } from "../..";
import { observer } from "mobx-react-lite";
import { Stories } from "../../components/crmComponents/stories/Stories";

export const CRM = observer(({ getAuthCode }) => {
    const location = useLocation()
    const { user_store } = useContext(Context)
    const { tab, authcode } = queryString.parse(location.search)
    const [user, setUser] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [sendNumber, setSendNumber] = useState('')
    const [password, setPassword] = useState('')
    const [passwordTip, setPasswordTip] = useState('')
    const [crmTab, setCrmTab] = useState('')
    const [userId, setUserId] = useState('')
    const [order, setOrder] = useState('')

    const handleUser = (id) => {
        setCrmTab('users')
        setUserId(id)
        setOrder(null)
    }

    const handleOrder = (order) => {
        setCrmTab('orders')
        setUserId(null)
        setOrder(order)
    }

    const handlePhone = (e) => {
        const formattedNumber = formatPhoneNumber(e)
        const cleaned = ('' + e.target.value).replace(/\D/g, '')
        setPhoneNumber(formattedNumber)
        setSendNumber(cleaned)
    }

    const formatPhoneNumber = (e) => {
        let cleaned
        cleaned = ('' + e.target.value).replace(/\D/g, '')
        if (e.target.value[0] === '+' && e.target.value[1] === '7') {
            cleaned = ('' + e.target.value.slice(2)).replace(/\D/g, '')
        } else if ((e.target.value[0] === '8' || e.target.value[0] === '7') && e.target.value.length > 1) {
            cleaned = ('' + e.target.value.splice(1)).replace(/\D/g, '')
        } else {
            cleaned = ('' + e.target.value).replace(/\D/g, '')
        }
        setSendNumber('7' + cleaned)
        const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/)
        let formattedNumber
        switch (cleaned.length) {
            case 10:
                formattedNumber = !match ? '' : `(${match[1]}) ${match[2]}-${match[3]}-${match[4]}`
                break
            case 9:
                formattedNumber = !match ? '' : `(${match[1]}) ${match[2]}-${match[3]}-${match[4]}`
                break
            case 8:
                formattedNumber = !match ? '' : `(${match[1]}) ${match[2]}-${match[3]}-`
                break
            case 7:
                formattedNumber = !match ? '' : `(${match[1]}) ${match[2]}-${match[3]}`
                break
            case 6:
                formattedNumber = !match ? '' : `(${match[1]}) ${match[2]}-`
                break
            case 5:
                formattedNumber = !match ? '' : `(${match[1]}) ${match[2]}`
                break
            case 4:
                formattedNumber = !match ? '' : `(${match[1]}) ${match[2]}`
                break
            case 3:
                formattedNumber = !match ? '' : `(${match[1]}) `
                break
            case 2:
                formattedNumber = !match ? '' : `(${match[1]}`
                break
            case 1:
                formattedNumber = !match ? '' : `(${match[1]}`
                break
            case 0:
                formattedNumber = !match ? '' : ``
                break

            default:
                break
        }
        return '+7 ' + formattedNumber
    }

    const handleBackspace = (e) => {
        if (e.keyCode === 8 || e.key === 'Backspace') {
            e.preventDefault()
            const cleaned = ('' + e.target.value.slice(3)).replace(/\D/g, '')
            const match = cleaned.split('')
            let formattedNumber
            let isEmpty = false
            switch (cleaned.length) {
                case 10:
                    formattedNumber = !match ? '' :
                        `(${match[0]}${match[1]}${match[2]}) ${match[3]}${match[4]}${match[5]}-${match[6]}${match[7]}-${match[8]}`
                    break
                case 9:
                    formattedNumber = !match ? '' :
                        `(${match[0]}${match[1]}${match[2]}) ${match[3]}${match[4]}${match[5]}-${match[6]}${match[7]}-`
                    break
                case 8:
                    formattedNumber = !match ? '' :
                        `(${match[0]}${match[1]}${match[2]}) ${match[3]}${match[4]}${match[5]}-${match[6]}`
                    break
                case 7:
                    formattedNumber = !match ? '' :
                        `(${match[0]}${match[1]}${match[2]}) ${match[3]}${match[4]}${match[5]}-`
                    break
                case 6:
                    formattedNumber = !match ? '' :
                        `(${match[0]}${match[1]}${match[2]}) ${match[3]}${match[4]}`
                    break
                case 5:
                    formattedNumber = !match ? '' :
                        `(${match[0]}${match[1]}${match[2]}) ${match[3]}`
                    break
                case 4:
                    formattedNumber = !match ? '' :
                        `(${match[0]}${match[1]}${match[2]}) `
                    break
                case 3:
                    formattedNumber = !match ? '' :
                        `(${match[0]}${match[1]}`
                    break
                case 2:
                    formattedNumber = !match ? '' :
                        `(${match[0]}`
                    break
                case 1:
                    formattedNumber = !match ? '' : ``
                    isEmpty = true
                    break
                case 0:
                    formattedNumber = !match ? '' : ``
                    isEmpty = true
                    break

                default:
                    break
            }
            const newCleaned = ('7' + formattedNumber).replace(/\D/g, '')
            if (!isEmpty) setPhoneNumber('+7 ' + formattedNumber)
            else setPhoneNumber(formattedNumber)
            setSendNumber(newCleaned)
        }
    }

    const checkUserFunc = async () => {
        try {
            await checkUser().then(async (data) => {
                setUser(data.user)
                if (!crmTab) {
                    setCrmTab('orders')
                    setUserId(null)
                    setOrder(null)
                }
            })
        } catch (e) {

        }
    }

    const logIn = async () => {
        try {
            await login(sendNumber, password).then((data) => {
                setUser(data.user)
                user_store.setUser(data.user)
                if (data.user.role !== 'admin' && data.user.role !== 'main' && data.user.role !== 'dev') {
                    setPasswordTip('Данный пользователь не является администратором')
                } else {
                    setPasswordTip('')
                }
            })
        } catch (e) {
            if (e.response && e.response.data && e.response.data.message) {
                setPasswordTip(e.response.data.message)
            } else {
                setPasswordTip('Произошла ошибка')
            }
            setPassword('')
        }
    }

    const onParse = () => {
        setCrmTab('items')
        setUserId(null)
        setOrder(null)
    }

    useEffect(() => {
        checkUserFunc()
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (user.role === 'admin' || user.role === 'main' || user.role === 'dev') {
            setCrmTab(tab ? tab : 'orders')
            setUserId(null)
            setOrder(null)
        }
    }, [tab, user])

    useEffect(() => {
        getAuthCode(authcode)
        // eslint-disable-next-line
    }, [authcode])

    useEffect(() => {
        checkUserFunc()
        // eslint-disable-next-line
    }, [user_store.user])

    return (
        <div className="CRM MBInfo">
            <div className="CRMContainer">
                <h2>
                    Система управления
                    {crmTab === 'items' ?
                        ' товарами'
                        : (crmTab === 'orders') ?
                            ' заказами'
                            : (crmTab === 'settings') ?
                                ' - Настройки'
                                : (crmTab === 'api') ?
                                    ' - Poizon API'
                                    : (crmTab === 'users') &&
                                    ' пользователями'
                    }
                </h2>
            </div>
            {user.role !== 'admin' && user.role !== 'main' && user.role !== 'dev' ?
                <div className="CRMLogIn">
                    <h4>Войдите в аккаунт администратора</h4>
                    <input className="CRMLogInput" type="text" value={phoneNumber} maxLength={18} onChange={handlePhone} onKeyDown={handleBackspace} placeholder="Номер телефона" />
                    <input className="CRMLogInput" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль" />
                    <div className={`CRMLogBtn ${sendNumber.length === 11 && password.length > 0 ? 'Active' : ''}`} onClick={logIn}>Войти</div>
                    <div className="CRMPassTip">{passwordTip}</div>
                </div>
                :
                <div className="CRMRow">
                    <div className="ProfileMenu">
                        <div className={`PMenuBtn ${crmTab === 'orders' ? 'Active' : ''}`} onClick={() => {
                            setCrmTab('orders')
                            setUserId(null)
                            setOrder(null)
                        }}>Заказы</div>
                        <div className={`PMenuBtn ${crmTab === 'api' ? 'Active' : ''}`} onClick={() => {
                            setCrmTab('api')
                            setUserId(null)
                            setOrder(null)
                        }}>Poizon API</div>
                        <div className={`PMenuBtn ${crmTab === 'items' ? 'Active' : ''}`} onClick={() => {
                            setCrmTab('items')
                            setUserId(null)
                            setOrder(null)
                        }}>Товары</div>
                        <div className={`PMenuBtn ${crmTab === 'users' ? 'Active' : ''}`} onClick={() => {
                            setCrmTab('users')
                            setUserId(null)
                            setOrder(null)
                        }}>Пользователи</div>
                        {(user.chat_id === '525881782') &&
                            <>
                                <div className={`PMenuBtn ${crmTab === 'stories' ? 'Active' : ''}`} onClick={() => {
                                    setCrmTab('stories')
                                    setUserId(null)
                                    setOrder(null)
                                }}>Сторис</div>
                            </>
                        }
                        <div className={`PMenuBtn ${crmTab === 'settings' ? 'Active' : ''}`} onClick={() => {
                            setCrmTab('settings')
                            setUserId(null)
                            setOrder(null)
                        }}>Настройки</div>
                    </div>
                    {crmTab === 'items' ?
                        <Items />
                        : (crmTab === 'orders') ?
                            <Orders order={order} onUser={handleUser} />
                            : (crmTab === 'settings') ?
                                <Settings />
                                : (crmTab === 'api') ?
                                    <PoizonParse onDownload={onParse} />
                                    : (crmTab === 'users') ?
                                        <Users userId={userId} onOrder={handleOrder} />
                                        : (crmTab === 'stories') &&
                                        <Stories />
                    }
                </div>
            }
        </div>
    )
})