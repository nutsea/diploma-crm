import React, { useState } from "react";
import './ProfileSettings.scss'
import { changePassword, setPassword } from "../../http/userAPI";

export const ProfileSettings = ({ user, onSetPassword }) => {
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [passwordTip, setPasswordTip] = useState('')
    const [passwordError, setPasswordError] = useState(0)

    const sendUpdatePassword = async () => {
        try {
            if (!user.password) {
                await setPassword(newPassword).then((data) => {
                    setOldPassword('')
                    setNewPassword('')
                    onSetPassword()
                    setPasswordTip(data.message)
                    setPasswordError(data.error)
                })
            } else {
                await changePassword(oldPassword, newPassword).then((data) => {
                    setOldPassword('')
                    setNewPassword('')
                    onSetPassword()
                    setPasswordTip(data.message)
                    setPasswordError(data.error)
                })
            }
        } catch (e) {
            setPasswordTip('Произошла ошибка')
            setPasswordError(true)
        }
    }

    return (
        <div className="ProfileSettings">
            <div className="ProfileSettingsSub">Пароль</div>
            {user.password &&
                <input className="ProfilePassInput" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="Введите старый пароль" />
            }
            <input className="ProfilePassInput" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Введите новый пароль" />
            <div className={`ProfileSavePass ${user.password ? (oldPassword.length > 0 && newPassword.length > 0 ? 'Active' : '') : (newPassword.length > 0 ? 'Active' : '')}`} onClick={sendUpdatePassword}>Сохранить изменения</div>
            {passwordTip.length > 0 &&
                <div className={`ProfilePassTip ${passwordError ? 'Red' : 'Green'}`}>{passwordTip}</div>
            }
        </div>
    )
}