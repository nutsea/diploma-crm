import React, { useEffect, useState } from "react";
import './UserCard.scss';

import { IoIosArrowBack, IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { TbCopy, TbCopyCheckFilled } from "react-icons/tb";

import { fetchUserOrders } from "../../../http/orderAPI";
import { createSyncKey, updateUserByAdmin } from "../../../http/userAPI";
import { OrderItem } from "../orders/order/OrderItem";

const roles = {
    'admin': 'Администратор',
    'main': 'Главный',
    'client': 'Клиент',
    'dev': 'Разработчик',
}

export const UserCard = ({ user, onBack, onOrder, onKey, onUpdate }) => {
    const [loading, setLoading] = useState(true)
    const [orders, setOrders] = useState([])
    const [listOpen, setListOpen] = useState(false)
    const [role, setRole] = useState(user.role)
    // eslint-disable-next-line
    const [name, setName] = useState(user.name)
    // eslint-disable-next-line
    const [surname, setSurname] = useState(user.surname)
    const [client, setClient] = useState(user.client)
    // eslint-disable-next-line
    const [phone, setPhone] = useState(user.phone)
    // eslint-disable-next-line
    const [socialMedia, setSocialMedia] = useState(user.link)
    // eslint-disable-next-line
    const [socialMediaType, setSocialMediaType] = useState(user.link_type !== 'tg' ? user.link_type : '')
    const [syncKey, setSyncKey] = useState(user.sync_key)
    // eslint-disable-next-line
    const [socialMediaListOpen, setSocialMediaListOpen] = useState(false)
    const [updated, setUpdated] = useState(false)
    const [error, setError] = useState(false)
    const [copied, setCopied] = useState('')

    const [isHovered, setIsHovered] = useState(false)
    const [position, setPosition] = useState({ x: 0, y: 0 })

    const generateKey = async (id) => {
        await createSyncKey(id).then(data => {
            setSyncKey(data.sync_key)
            onKey()
        })
    }

    const handleCopy = async (user) => {
        await navigator.clipboard.writeText(user.sync_key)
        setCopied(user.id)
    }

    const handleBack = () => {
        onBack()
    }

    const updateUserData = async () => {
        try {
            await updateUserByAdmin(user.id, name, surname, phone, socialMedia, socialMediaType, role, client).then(() => {
                setUpdated(true)
                setError(false)
                onUpdate()
            })
        } catch (e) {
            setError(true)
            setUpdated(false)
        }
    }

    // const handleChangeNumberInput = (e) => {
    //     e.target.value = e.target.value.replace(/[^\d]/g, '')
    //     switch (e.target.name) {
    //         case 'phone':
    //             setPhone(e.target.value)
    //             break
    //         default:
    //             break
    //     }
    // }

    const findOrders = async () => {
        try {
            await fetchUserOrders(user.id).then(data => {
                setOrders(data)
                setLoading(false)
            })
        } catch (e) {

        }
    }

    const handleMouseEnter = (e, id) => {
        setIsHovered(id)
        updatePosition(e)
    }

    const handleMouseMove = (e, id) => {
        if (e.target.closest('.noThumb')) setIsHovered('')
        else setIsHovered(id)
        updatePosition(e)
    }

    const handleMouseLeave = () => {
        setIsHovered('')
    }

    const updatePosition = (e) => {
        const { clientX: x, clientY: y } = e
        const tooltipElement = document.querySelector('.OrderThumbnail')
        const tooltipWidth = tooltipElement.getBoundingClientRect().width
        const tooltipHeight = tooltipElement.getBoundingClientRect().height
        const offset = 10

        let newX = x + offset
        let newY = y + offset

        if (newX + tooltipWidth + 30 > window.innerWidth) {
            newX = window.innerWidth - tooltipWidth - 20 - offset
        }

        if (newY + tooltipHeight + 30 > window.innerHeight) {
            newY = window.innerHeight - tooltipHeight - 20 - offset
        }

        setPosition({ x: newX, y: newY })
    }

    useEffect(() => {
        findOrders()
        // eslint-disable-next-line
    }, [])

    return (
        <div className="CRMUserCard">
            {loading ?
                <div className="LoaderBox2">
                    <div className="Loader"></div>
                </div>
                :
                <>
                    <div className="CRMBack" onClick={handleBack}>
                        <IoIosArrowBack size={14} />
                        <span className="CRMBackText">Все пользователи</span>
                    </div>
                    <div className="CRMOrderCardNum">Клиент</div>
                    <div className="OrderCardLineBeforeSub"></div>
                    <div className="CRMOrderCardSub">Основное</div>
                    <div className="CRMOrderCardRow">
                        <div className="CRMOrderCardCol">
                            <div className="CRMOrderInputBox">
                                <div className="CRMOrderCardTip">Клиент</div>
                                {/* <div className="CRMOrderCardInput UserCardText">{client ? ' ' + client : ''}</div> */}
                                <input className={`CRMOrderCardInput ${client && client.length > 0 ? '' : 'CursorBorderInput'}`} value={client} onChange={(e) => setClient(e.target.value)} />
                            </div>
                            {/* <div className="CRMOrderInputBox">
                                <div className="CRMOrderCardTip">Телефон получателя</div>
                                <div className="CRMOrderCardInput UserCardText">{phone ? ' ' + phone : ''}</div>
                                <input className={`CRMOrderCardInput ${phone && phone.length > 0 ? '' : 'CursorBorderInput'}`} maxLength={11} value={phone} name="phone" onChange={(e) => handleChangeNumberInput(e)} />
                            </div> */}
                        </div>
                        <div className="CRMOrderCardCol">
                            {/* <div className="CRMOrderInputBox">
                                <div className="CRMOrderCardTip">Соц. сеть для связи</div>
                                <div className="CRMOrderInputCol">
                                    <div className="OrderSelect" onClick={() => setSocialMediaListOpen(!socialMediaListOpen)}>
                                        <span>{socialMediaType}</span>
                                        {socialMediaListOpen ?
                                            <IoIosArrowUp size={14} />
                                            :
                                            <IoIosArrowDown size={14} />
                                        }
                                        {socialMediaListOpen &&
                                            <div className="OrderSelectList">
                                                <div className="OrderSelectItem" onClick={() => setSocialMediaType('VK')}>VK</div>
                                                <div className="OrderSelectItem" onClick={() => setSocialMediaType('Telegram')}>Telegram</div>
                                            </div>
                                        }
                                    </div>
                                    <input className={`CRMOrderCardInput ${socialMedia && socialMedia.length > 0 ? '' : 'CursorBorderInput'}`} value={socialMedia} onChange={(e) => setSocialMedia(e.target.value)} />
                                </div>
                            </div> */}
                            <div className="CRMOrderInputBox">
                                <div className="CRMOrderCardTip">VK</div>
                                <input className={`CRMOrderCardInput ${socialMedia && socialMedia.length > 0 ? '' : 'CursorBorderInput'}`} value={socialMedia} name="phone" onChange={(e) => setSocialMedia(e.target.value)} />
                            </div>
                            <div className="CRMOrderInputBox">
                                <div className="CRMOrderCardTip">Telegram</div>
                                <input className={`CRMOrderCardInput ${socialMediaType && socialMediaType.length > 0 ? '' : 'CursorBorderInput'}`} value={socialMediaType} name="phone" onChange={(e) => setSocialMediaType(e.target.value)} />
                            </div>
                            <div className="CRMOrderInputBox">
                                <div className="CRMOrderCardTip">Роль</div>
                                {role !== 'main' ?
                                    <div className="OrderSelect" onClick={() => setListOpen(!listOpen)}>
                                        <span>{roles[role]}</span>
                                        {listOpen ?
                                            <IoIosArrowUp size={14} />
                                            :
                                            <IoIosArrowDown size={14} />
                                        }
                                        {listOpen &&
                                            <div className="OrderSelectList">
                                                <div className="OrderSelectItem" onClick={() => setRole('admin')}>Администратор</div>
                                                <div className="OrderSelectItem" onClick={() => setRole('dev')}>Разработчик</div>
                                                <div className="OrderSelectItem" onClick={() => setRole('client')}>Клиент</div>
                                            </div>
                                        }
                                    </div>
                                    :
                                    <div className="CRMOrderCardInfo">Главный</div>
                                }
                            </div>
                            {role !== 'main' &&
                                <div className="CRMOrderInputBox">
                                    <div className="CRMOrderCardTip">Ключ</div>
                                    {syncKey ?
                                        <span className="GenerateKey GenerateKeyCard noClick" onClick={() => handleCopy(user)}>
                                            {copied === user.id ?
                                                <TbCopyCheckFilled className="CRMItemCopyIcon noClick" style={{ pointerEvents: 'none' }} />
                                                :
                                                <TbCopy className="CRMItemCopyIcon noClick" style={{ pointerEvents: 'none' }} />
                                            }
                                            <span className="noClick KeyCard">
                                                {syncKey}
                                            </span>
                                        </span>
                                        :
                                        <span className="GenerateKey noClick" onClick={() => generateKey(user.id)}>Получить</span>
                                    }
                                </div>
                            }
                        </div>
                    </div>
                    <div className="CRMOrderCardSaveBtn" onClick={updateUserData}>Сохранить</div>
                    {updated &&
                        <div className="ProfilePassTip Green">Данные обновлены</div>
                    }
                    {error &&
                        <div className="ProfilePassTip Red">Произошла ошибка</div>
                    }
                    <div className="OrderCardLineBeforeSub"></div>
                    {orders.length > 0 &&
                        <>
                            <div className="CRMOrderCardSub">Заказы</div>
                            {orders.length === 0 ?
                                <div>Заказы не найдены</div>
                                :
                                <div className="CRMUsersTableBox">
                                    <table className="CRMUsersTable">
                                        <thead>
                                            <tr>
                                                <th>id</th>
                                                {/* <th>Клиент</th> */}
                                                <th>Статус</th>
                                                <th>ФИО</th>
                                                <th>Телефон</th>
                                                <th>Доставка</th>
                                                <th>Оплата</th>
                                                <th>Сумма со скидкой</th>
                                                <th>Скидка</th>
                                                <th>Комиссия</th>
                                                <th>Курс</th>
                                                <th>Дата</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map((order, i) => {
                                                return (
                                                    <tr
                                                        key={i}
                                                        className={`CRMOrderTr ${order.status === 11 ? 'Canceled' : ''}`}
                                                        onMouseEnter={(e) => handleMouseEnter(e, order.id)}
                                                        onMouseMove={(e) => handleMouseMove(e, order.id)}
                                                        onMouseLeave={handleMouseLeave}
                                                        // onClick={(e) => handleChooseOrder(e, order)}
                                                        onClick={() => onOrder(order)}
                                                    >
                                                        <OrderItem order={order} isHovered={isHovered} position={position} isUser />
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            }
                        </>
                    }
                </>
            }
        </div>
    )
}