import React, { useEffect, useState } from "react";
import "./ProfileInfo.scss"

import close from '../../assets/close2.svg'
import done from '../../assets/done.svg'
import profile from '../../assets/profile.png'

export const ProfileInfo = ({ user, nameProp, surnameProp, phoneProp, onSendUpdate }) => {
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [sendNumber, setSendNumber] = useState('')

    const formatPhone = (phone) => {
        return `+${phone.slice(0, 1)} (${phone.slice(1, 4)}) ${phone.slice(4, 7)}-${phone.slice(7, 9)}-${phone.slice(9, 11)}`
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

    const sendUpdate = () => {
        onSendUpdate(name, surname, sendNumber)
    }

    useEffect(() => {
        setName(nameProp)
        setSurname(surnameProp)
        setSendNumber(phoneProp)
        if (phoneProp && phoneProp.length === 11) {
            setPhoneNumber(formatPhone(phoneProp))
        }
    }, [nameProp, surnameProp, phoneProp])

    return (
        <div className="ProfileInfo">
            <div className="ProfileInitials">
                {(!user || (!user.name && !user.surname)) &&
                    <img src={profile} alt="" />
                }
                {user && user.name &&
                    <span>{user.name[0]}</span>
                }
                {user && user.surname &&
                    <span>{user.surname[0]}</span>
                }
            </div>
            <div className="ProfileInputs">
                <div className="InputsRow">
                    <div className="ProfileInputBox">
                        <label>Имя</label>
                        <div className="InputRelative">
                            <input className="NameInput" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                            {name && name.length > 0 &&
                                <div className="InputClose" onClick={() => setName('')}><img src={close} alt="Стереть" /></div>
                            }
                        </div>
                    </div>
                    <div className="ProfileInputBox">
                        <label>Фамилия</label>
                        <div className="InputRelative">
                            <input type="text" value={surname} onChange={(e) => setSurname(e.target.value)} />
                            {surname && surname.length > 0 &&
                                <div className="InputClose" onClick={() => setSurname('')}><img src={close} alt="Стереть" /></div>
                            }
                        </div>
                    </div>
                </div>
                <div className="InputsRow">
                    <div className="ProfileInputBox">
                        <label>Телефон</label>
                        <div className="InputRelative">
                            <input className="PhoneInput" type="text" value={phoneNumber} maxLength={18} onChange={handlePhone} onKeyDown={handleBackspace} />
                            {user && user.phone &&
                                <div className="InputClose"><img src={done} alt="Подтвержден" /></div>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="ProfileSaveBtn" onClick={sendUpdate}>Сохранить изменения</div>
        </div>
    )
}