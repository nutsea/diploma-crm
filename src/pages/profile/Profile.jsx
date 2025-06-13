import React, { useEffect, useState } from "react"
import './Profile.scss'
import { checkUser, updateUser } from "../../http/userAPI"

import { useLocation, useNavigate } from "react-router-dom"
import { ProfileInfo } from "../../components/profileInfo/ProfileInfo"
import queryString from "query-string";
import { ProfileSettings } from "../../components/profileSettings/ProfileSettings"
import { observer } from "mobx-react-lite"

export const Profile = observer(() => {
    const navigate = useNavigate()
    const location = useLocation()
    const { tab } = queryString.parse(location.search)
    const [isAuth, setIsAuth] = useState(false)
    const [user, setUser] = useState({})
    const [profileTab, setProfileTab] = useState('data')
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [phone, setPhone] = useState('')

    const checkToken = async () => {
        try {
            await checkUser().then(data => {
                setUser(data.user)
                setName(data.user.name)
                setSurname(data.user.surname)
                setPhone(data.user.phone)
            })
            setIsAuth(true)
        } catch (e) {
            localStorage.removeItem('token')
        }
    }

    const sendUpdate = async (name, surname, phone) => {
        try {
            if (phone.length !== 11 && phone.length !== 0 && phone !== '7') {
                document.querySelector('.PhoneInput').classList.add('Error')
            } else {
                await updateUser(name, surname, phone).then(data => {
                    document.querySelector('.PhoneInput').classList.remove('Error')
                    setUser(data)
                    setName(data.name)
                    setSurname(data.surname)
                    setPhone(data.phone)
                })
            }
        } catch (e) {

        }
    }

    const logOut = async () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setIsAuth(false)
        setUser({})
        navigate('/')
        window.location.reload()
    }

    useEffect(() => {
        checkToken()
    }, [])

    useEffect(() => {
        setProfileTab(tab ? tab : 'data')
    }, [tab])

    return (
        <div className="MainContainer MBInfo">
            {isAuth && user ?
                <>
                    {profileTab === 'data' ?
                        <h2 className="ProfileSub">Личные данные</h2>
                        : (profileTab === 'settings') &&
                        <h2 className="ProfileSub MyOrdersSub">Настройки</h2>
                    }
                    <div className="ProfileRow">
                        <div className="ProfileMenu">
                            <div className={`PMenuBtn ${profileTab === 'data' ? 'Active' : ''}`} onClick={() => setProfileTab('data')}>Профиль</div>
                            {(user.role === 'admin' || user.role === 'main' || user.role === 'dev') &&
                                <>
                                    <div className={`PMenuBtn`} onClick={() => navigate('/')}>CRM</div>
                                    <div className={`PMenuBtn ${profileTab === 'settings' ? 'Active' : ''}`} onClick={() => setProfileTab('settings')}>Настройки</div>
                                </>
                            }
                            <div className={`PMenuBtn`} onClick={logOut}>Выйти</div>
                        </div>
                        {profileTab === 'data' ?
                            <ProfileInfo user={user} nameProp={name} surnameProp={surname} phoneProp={phone} onSendUpdate={sendUpdate} />
                            : (profileTab === 'settings') &&
                            <ProfileSettings user={user} onSetPassword={checkToken} />
                        }
                    </div>
                </>
                :
                <></>
            }
        </div>
    )
})