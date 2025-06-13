import React, { useEffect, useState } from "react";
import './Orders.scss'
import { fetchOrders, fetchOrdersIn, updateStatus } from "../../../http/orderAPI";
import { RxUpdate } from "react-icons/rx";
import { BsTrash3 } from "react-icons/bs";
import loop1 from '../../../assets/loop1.svg'
import { OrderItem } from "./order/OrderItem";
import { OrderCard } from "../orderCard/OrderCard";
import { OrderCreate } from "../orderCreate/OrderCreate";
import { OrderItemWork } from "./order/OrderItemWork";
import FormatPrice from "../../../utils/FormatPrice";
import { Manager } from "./order/Manager";

const statusArray = [
    { 1: 'Принят' },
    { 2: 'Выкуплен' },
    { 3: 'Получен трек' },
    { 4: 'Принят в Китае' },
    { 5: 'Оформляется' },
    { 6: 'Доставляется в Россию' },
    { 7: 'Прибыл в Россию' },
    { 8: 'Передан в СДЭК' },
    { 9: 'Выполнен' },
    { 10: 'Требует уточнений' },
    { 11: 'Отменен' }
]

const statusArray2 = {
    0: 'В обработке',
    1: 'Принят',
    2: 'Выкуплен',
    3: 'Получен трек',
    4: 'Принят в китае',
    5: 'Оформляется',
    6: 'Доставляется в Россию',
    7: 'Прибыл в Россию',
    8: 'Передан в СДЭК',
    9: 'Выполнен',
    10: 'Требует уточнений',
    11: 'Отменен',
}

export const Orders = ({ onUser, order }) => {
    const [isFocus, setIsFocus] = useState(false)
    const [search, setSearch] = useState('')
    const [ordersTab, setOrdersTab] = useState('in')
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(false)
    const [checked, setChecked] = useState([])
    const [isTakeModal, setIsTakeModal] = useState(false)
    const [isDeleteModal, setIsDeleteModal] = useState(false)
    const [isStatusModal, setIsStatusModal] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [chosenOrder, setChosenOrder] = useState(null)
    const [status, setStatus] = useState('')
    const [statuses, setStatuses] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
    const [statusesShow, setStatusesShow] = useState(false)

    const formatPhone = (phone) => {
        return `+${phone.slice(0, 1)} (${phone.slice(1, 4)}) ${phone.slice(4, 7)}-${phone.slice(7, 9)}-${phone.slice(9, 11)}`
    }

    const formatDate = (date) => {
        const newDate = new Date(date);
        const day = newDate.getDate().toString().padStart(2, '0');
        const month = (newDate.getMonth() + 1).toString().padStart(2, '0');
        const year = newDate.getFullYear().toString();
        return `${day}.${month}.${year}`;
    }

    const findAllOrders = async (isLoading, isClear) => {
        setLoading(isLoading)
        isLoading === true && setChecked([])
        if (isClear === true) {
            setChecked([])
        }
        await fetchOrders(search, statuses).then(data => {
            setOrders(data)
            setLoading(false)
            if (chosenOrder) {
                setChosenOrder(data.find(order => order.id === chosenOrder.id))
            }
        })
    }

    const findOrdersIn = async (isLoading, isClear) => {
        setLoading(isLoading)
        isLoading === true && setChecked([])
        if (isClear === true) {
            setOrders([])
        }
        await fetchOrdersIn(search).then(data => {
            setOrders(data)
            setLoading(false)
            if (chosenOrder) {
                setChosenOrder(data.find(order => order.id === chosenOrder.id))
            }
        })
    }

    const handleChooseStatuses = () => {
        setStatusesShow(false)
        findAllOrders(true, false)
    }

    const checkAll = () => {
        if (orders.map(order => order.id).every(id => checked.includes(id))) {
            setChecked(checked.filter(id => !orders.map(order => order.id).includes(id)))
            const checkboxes = document.querySelectorAll('#itemCheck')
            checkboxes.forEach(checkbox => {
                checkbox.checked = false
            })
        } else {
            setChecked(orders.map(order => order.id))
            const checkboxes = document.querySelectorAll('#itemCheck')
            checkboxes.forEach(checkbox => {
                checkbox.checked = true
            })
        }
    }

    const handleCheck = (id) => {
        if (checked.includes(id)) {
            setChecked(checked.filter(i => i !== id))
        } else {
            setChecked([...checked, id])
        }
    }

    const handleTake = async () => {
        const taken = checked.map(async id => {
            await updateStatus(id, 1)
        })
        Promise.all(taken).then(() => {
            if (ordersTab === 'in') {
                findOrdersIn(true, true)
            }
            if (ordersTab === 'work') {
                findAllOrders(true, true)
            }
            setIsTakeModal(false)
        })
    }

    const handleCancel = async () => {
        const taken = checked.map(async id => {
            await updateStatus(id, 11)
        })
        Promise.all(taken).then(() => {
            if (ordersTab === 'in') {
                findOrdersIn(true, true)
            }
            if (ordersTab === 'work') {
                findAllOrders(true, true)
            }
            setIsDeleteModal(false)
        })
    }

    const handleUpdateStatus = async () => {
        const taken = checked.map(async id => {
            await updateStatus(id, Number(status))
        })
        Promise.all(taken).then(() => {
            if (ordersTab === 'in') {
                findOrdersIn(true, true)
            }
            if (ordersTab === 'work') {
                findAllOrders(true, true)
            }
            setIsStatusModal(false)
        })
    }

    const handleChooseOrder = (e, order) => {
        if (e.target.closest('.noThumb')) return
        setChosenOrder(order)
        window.scrollTo({
            top: 150,
            behavior: 'smooth'
        })
    }

    const handleBackOrder = () => {
        setChosenOrder(null)
        setIsHovered('')
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

    const setTabIn = () => {
        setOrdersTab('in')
    }

    const handleSave = () => {
        if (ordersTab === 'in') {
            findOrdersIn(true, true)
        }
        if (ordersTab === 'work') {
            findAllOrders(true, true)
        }
    }

    useEffect(() => {
        setStatusesShow(false)
        if (ordersTab === 'in') {
            findOrdersIn(true, true)
        }
        if (ordersTab === 'work') {
            findAllOrders(true, true)
        }
        if (ordersTab === 'canceled') {
            findAllOrders(true, true)
        }
        // eslint-disable-next-line
    }, [ordersTab])

    useEffect(() => {
        if (ordersTab === 'in') {
            findOrdersIn(false, true)
        }
        if (ordersTab === 'work') {
            findAllOrders(false, true)
        }
        // eslint-disable-next-line
    }, [search])

    useEffect(() => {
        setChosenOrder(order)
    }, [order])

    return (
        <div className="CRMOrders">
            {chosenOrder ?
                <OrderCard order={chosenOrder} onBack={handleBackOrder} onSave={handleSave} onUser={onUser} />
                :
                <>
                    <div className="CRMOrdersTabs">
                        <div className={`CRMOrdersTab ${ordersTab === 'in' ? 'Active' : ''}`} onClick={() => setOrdersTab('in')}>Входящие заказы</div>
                        <div className="CRMOrdersTabLine"></div>
                        <div className={`CRMOrdersTab ${ordersTab === 'work' ? 'Active' : ''}`} onClick={() => setOrdersTab('work')}>Заказы</div>
                        <div className="CRMOrdersTabLine"></div>
                        <div className={`CRMOrdersTab ${ordersTab === 'canceled' ? 'Active' : ''}`} onClick={() => setOrdersTab('canceled')}>Отмененные</div>
                        <div className="CRMOrdersTabLine"></div>
                        <div className={`CRMOrdersTab ${ordersTab === 'create' ? 'Active' : ''}`} onClick={() => setOrdersTab('create')}>Создать заказ</div>
                    </div>
                    {loading &&
                        <div className="LoaderBox2">
                            <div className="Loader"></div>
                        </div>
                    }
                    {!loading && ordersTab !== 'create' &&
                        <div className={`CRMSearchOrders ${isFocus ? 'Focused' : ''}`}>
                            <img src={loop1} alt="Поиск" />
                            <input
                                type="text"
                                placeholder='Поиск по заказам'
                                onFocus={() => setIsFocus(true)}
                                onBlur={() => setIsFocus(false)}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    }
                    {!loading && ordersTab === 'work' &&
                        <div className="CRMOrdersShowStatuses">
                            <span className="CRMOrdersShowStatusesBtn" onClick={() => setStatusesShow(!statusesShow)}>Выбрать статусы</span>
                            {statusesShow &&
                                <div className="CRMOrdersShowStatusesBox">
                                    {statusArray.map((status, i) => {
                                        return (
                                            <div key={i} className="CRMOrdersShowStatusItem">
                                                <input
                                                    type="checkbox"
                                                    checked={statuses.includes(i + 1)}
                                                    onChange={() => {
                                                        statuses.includes(i + 1) ?
                                                            setStatuses(statuses.filter(j => j !== i + 1)) :
                                                            setStatuses((prev) => [...prev, i + 1])
                                                    }}
                                                />
                                                <span>{status[i + 1]}</span>
                                            </div>
                                        )
                                    })}
                                    <div className="CRMConfirmStatusesBtn" onClick={handleChooseStatuses}>Применить</div>
                                </div>
                            }
                        </div>
                    }
                    {ordersTab === 'in' && !loading &&
                        <>
                            {orders && orders.length > 0 ?
                                <>
                                    <div className="CRMOrdersChecked">Выбрано: {checked.length}</div>
                                    <div className="CRMOrdersBtns">
                                        {ordersTab === 'in' &&
                                            <div className={`CRMOrdersTakeBtn ${checked.length > 0 ? '' : 'Inactive'}`} onClick={() => setIsTakeModal(true)}>
                                                <RxUpdate size={16} />
                                                <span>Принять выбранное</span>
                                            </div>
                                        }
                                        {ordersTab === 'work' &&
                                            <div className={`CRMOrdersTakeBtn ${checked.length > 0 ? '' : 'Inactive'}`} onClick={() => setIsStatusModal(true)}>
                                                <RxUpdate size={16} />
                                                <span>Обновить статусы</span>
                                            </div>
                                        }
                                        <div className={`CRMOrdersDeleteBtn ${checked.length > 0 ? '' : 'Inactive'}`} onClick={() => setIsDeleteModal(true)}>
                                            <BsTrash3 size={16} />
                                            <span>Отменить выбранное</span>
                                        </div>
                                    </div>
                                    {isTakeModal &&
                                        <div className="CRMDeleteModalBox">
                                            <div className="CRMDeleteModal">
                                                <div className="CRMDeleteModalTitle">Принять выбранные заказы ({checked.length})?</div>
                                                <div className="CRMDeleteModalBtns">
                                                    <div
                                                        className="CRMDeleteModalBtn DeleteModalBtnCancel"
                                                        onClick={() => {
                                                            setIsTakeModal(false)
                                                        }}
                                                    >
                                                        Отмена
                                                    </div>
                                                    <div className="CRMDeleteModalBtn DeleteModalBtnUpdate" onClick={handleTake}>Принять</div>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    {isStatusModal &&
                                        <div className="CRMDeleteModalBox">
                                            <div className="CRMDeleteModal">
                                                <div className="CRMDeleteModalTitle">Обновить статусы выбранных заказов</div>
                                                <input className="CRMOrderStatusInput" type="number" placeholder="Новый статус" value={status} onChange={(e) => setStatus(e.target.value)} />
                                                <div className="CRMDeleteModalBtns">
                                                    <div
                                                        className="CRMDeleteModalBtn DeleteModalBtnCancel"
                                                        onClick={() => {
                                                            setIsStatusModal(false)
                                                        }}
                                                    >
                                                        Отмена
                                                    </div>
                                                    <div className="CRMDeleteModalBtn DeleteModalBtnUpdate" onClick={handleUpdateStatus}>Обновить</div>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    {isDeleteModal &&
                                        <div className="CRMDeleteModalBox">
                                            <div className="CRMDeleteModal">
                                                <div className="CRMDeleteModalTitle">Отменить выбранные заказы ({checked.length})?</div>
                                                <div className="CRMDeleteModalBtns">
                                                    <div
                                                        className="CRMDeleteModalBtn DeleteModalBtnCancel"
                                                        onClick={() => {
                                                            setIsDeleteModal(false)
                                                        }}
                                                    >
                                                        Отмена
                                                    </div>
                                                    <div className="CRMDeleteModalBtn DeleteModalBtnDelete" onClick={handleCancel}>Отменить</div>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    <div className="CRMOrdersTableBox">
                                        <table className="CRMOrdersTable">
                                            <thead>
                                                <tr>
                                                    <th>
                                                        <input
                                                            className="CRMItemCheck"
                                                            type="checkbox"
                                                            id="itemCheck"
                                                            onChange={checkAll}
                                                            checked={orders.map(order => order.id).every(id => checked.includes(id))}
                                                        />
                                                    </th>
                                                    <th>id</th>
                                                    <th>Клиент</th>
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
                                                            onClick={(e) => handleChooseOrder(e, order)}
                                                        >
                                                            <td className="noThumb">
                                                                <input
                                                                    className="CRMItemCheck noThumb"
                                                                    type="checkbox"
                                                                    id="itemCheck"
                                                                    onChange={() => handleCheck(order.id)}
                                                                    checked={checked.includes(order.id)}
                                                                />
                                                            </td>
                                                            <OrderItem order={order} orderType={ordersTab} isHovered={isHovered} position={position} />
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="OrderTiles">
                                        {orders.map((order, i) => {
                                            return (
                                                <div key={i} className="OrderTile" onClick={(e) => handleChooseOrder(e, order)}>
                                                    <div className="OTRow noThumb">
                                                        <div className="OTLeftCol noThumb">
                                                            <input
                                                                className="CRMItemCheck noThumb"
                                                                type="checkbox"
                                                                id="itemCheck"
                                                                onChange={() => handleCheck(order.id)}
                                                                checked={checked.includes(order.id)}
                                                            />
                                                        </div>
                                                        <div className="OTRightCol noThumb"></div>
                                                    </div>
                                                    <div className="OTRow">
                                                        <div className="OTLeftCol">id</div>
                                                        <div className="OTRightCol">{order.paid > 0 ? 'WP' : 'R'}{order.id}</div>
                                                    </div>
                                                    <div className="OTRow">
                                                        <div className="OTLeftCol">Клиент</div>
                                                        <div className="OTRightCol">{order.name}</div>
                                                    </div>
                                                    <div className="OTRow">
                                                        <div className="OTLeftCol">ФИО</div>
                                                        <div className="OTRightCol">{order.recipient}</div>
                                                    </div>
                                                    <div className="OTRow">
                                                        <div className="OTLeftCol">Телефон</div>
                                                        <div className="OTRightCol">{formatPhone(order.phone)}</div>
                                                    </div>
                                                    <div className="OTRow">
                                                        <div className="OTLeftCol">Доставка</div>
                                                        <div className="OTRightCol">{order.ship_type === 'home' ? 'Курьер' : (order.ship_type === 'point') && 'Пункт выдачи'}</div>
                                                    </div>
                                                    <div className="OTRow">
                                                        <div className="OTLeftCol">Оплата</div>
                                                        <div className="OTRightCol">{order.is_split ? 'Сплит' : 'Полная'}</div>
                                                    </div>
                                                    <div className="OTRow">
                                                        <div className="OTLeftCol">Сумма со скидкой</div>
                                                        <div className="OTRightCol">{FormatPrice.formatPrice(order.discount_cost)} ₽</div>
                                                    </div>
                                                    <div className="OTRow">
                                                        <div className="OTLeftCol">Скидка</div>
                                                        <div className="OTRightCol">{FormatPrice.formatPrice(order.discount)} ₽</div>
                                                    </div>
                                                    <div className="OTRow">
                                                        <div className="OTLeftCol">Комиссия</div>
                                                        <div className="OTRightCol">{order.fee} ₽</div>
                                                    </div>
                                                    <div className="OTRow">
                                                        <div className="OTLeftCol">Курс</div>
                                                        <div className="OTRightCol">{order.course} ₽</div>
                                                    </div>
                                                    <div className="OTRow">
                                                        <div className="OTLeftCol">Дата</div>
                                                        <div className="OTRightCol">{formatDate(order.createdAt)}</div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </>
                                :
                                <div className="CRMOrdersEmpty">Заказы не найдены</div>
                            }
                        </>
                    }
                    {((ordersTab === 'work' && orders.find(item => item.status !== 11)) || (ordersTab === 'canceled' && orders.find(item => item.status === 11))) && !loading &&
                        <>
                            {orders && orders.length > 0 ?
                                <>
                                    {ordersTab !== 'canceled' &&
                                        <div className="CRMOrdersChecked">Выбрано: {checked.length}</div>
                                    }
                                    <div className="CRMOrdersBtns">
                                        {ordersTab === 'in' &&
                                            <div className={`CRMOrdersTakeBtn ${checked.length > 0 ? '' : 'Inactive'}`} onClick={() => setIsTakeModal(true)}>
                                                <RxUpdate size={16} />
                                                <span>Принять выбранное</span>
                                            </div>
                                        }
                                        {ordersTab === 'work' &&
                                            <div className={`CRMOrdersTakeBtn ${checked.length > 0 ? '' : 'Inactive'}`} onClick={() => setIsStatusModal(true)}>
                                                <RxUpdate size={16} />
                                                <span>Обновить статусы</span>
                                            </div>
                                        }
                                        {ordersTab === 'work' &&
                                            <div className={`CRMOrdersDeleteBtn ${checked.length > 0 ? '' : 'Inactive'}`} onClick={() => setIsDeleteModal(true)}>
                                                <BsTrash3 size={16} />
                                                <span>Отменить выбранное</span>
                                            </div>
                                        }
                                    </div>
                                    {isTakeModal &&
                                        <div className="CRMDeleteModalBox">
                                            <div className="CRMDeleteModal">
                                                <div className="CRMDeleteModalTitle">Принять выбранные заказы ({checked.length})?</div>
                                                <div className="CRMDeleteModalBtns">
                                                    <div
                                                        className="CRMDeleteModalBtn DeleteModalBtnCancel"
                                                        onClick={() => {
                                                            setIsTakeModal(false)
                                                        }}
                                                    >
                                                        Отмена
                                                    </div>
                                                    <div className="CRMDeleteModalBtn DeleteModalBtnUpdate" onClick={handleTake}>Принять</div>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    {isStatusModal &&
                                        <div className="CRMDeleteModalBox">
                                            <div className="CRMDeleteModal">
                                                <div className="CRMDeleteModalTitle">Обновить статусы выбранных заказов</div>
                                                <input className="CRMOrderStatusInput" type="number" placeholder="Новый статус" value={status} onChange={(e) => setStatus(e.target.value)} />
                                                <div className="CRMDeleteModalBtns">
                                                    <div
                                                        className="CRMDeleteModalBtn DeleteModalBtnCancel"
                                                        onClick={() => {
                                                            setIsStatusModal(false)
                                                        }}
                                                    >
                                                        Отмена
                                                    </div>
                                                    <div className="CRMDeleteModalBtn DeleteModalBtnUpdate" onClick={handleUpdateStatus}>Обновить</div>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    {isDeleteModal &&
                                        <div className="CRMDeleteModalBox">
                                            <div className="CRMDeleteModal">
                                                <div className="CRMDeleteModalTitle">Отменить выбранные заказы ({checked.length})?</div>
                                                <div className="CRMDeleteModalBtns">
                                                    <div
                                                        className="CRMDeleteModalBtn DeleteModalBtnCancel"
                                                        onClick={() => {
                                                            setIsDeleteModal(false)
                                                        }}
                                                    >
                                                        Отмена
                                                    </div>
                                                    <div className="CRMDeleteModalBtn DeleteModalBtnDelete" onClick={handleCancel}>Отменить</div>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    <div className="CRMOrdersTableBox">
                                        <table className="CRMOrdersTable">
                                            <thead>
                                                <tr>
                                                    <th>
                                                        <input
                                                            className="CRMItemCheck"
                                                            type="checkbox"
                                                            id="itemCheck"
                                                            onChange={checkAll}
                                                            checked={orders.map(order => order.id).every(id => checked.includes(id))}
                                                        />
                                                    </th>
                                                    <th>id</th>
                                                    <th>Статус</th>
                                                    <th>Клиент</th>
                                                    <th>Трек</th>
                                                    <th>Трек СДЭК</th>
                                                    <th>Менеджер</th>
                                                    <th>Сумма заказа</th>
                                                    <th>Дата</th>
                                                    <th>Сплит</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orders.map((order, i) => {
                                                    if (ordersTab === 'canceled' && order.status !== 11) return null
                                                    if (ordersTab === 'work' && order.status === 11) return null
                                                    return (
                                                        <tr
                                                            key={i}
                                                            className="CRMOrderTr"
                                                            onMouseEnter={(e) => handleMouseEnter(e, order.id)}
                                                            onMouseMove={(e) => handleMouseMove(e, order.id)}
                                                            onMouseLeave={handleMouseLeave}
                                                            onClick={(e) => handleChooseOrder(e, order)}
                                                        >
                                                            <td className="noThumb">
                                                                <input
                                                                    className="CRMItemCheck noThumb"
                                                                    type="checkbox"
                                                                    id="itemCheck"
                                                                    onChange={() => handleCheck(order.id)}
                                                                    checked={checked.includes(order.id)}
                                                                />
                                                            </td>
                                                            <OrderItemWork order={order} orderType={ordersTab} isHovered={isHovered} position={position} />
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="OrderTiles">
                                        {orders.map((order, i) => {
                                            if (ordersTab === 'canceled' && order.status !== 11) return null
                                            if (ordersTab === 'work' && order.status === 11) return null
                                            return (
                                                <div key={i} className="OrderTile" onClick={(e) => handleChooseOrder(e, order)}>
                                                    <div className="OTRow noThumb">
                                                        <div className="OTLeftCol noThumb">
                                                            <input
                                                                className="CRMItemCheck noThumb"
                                                                type="checkbox"
                                                                id="itemCheck"
                                                                onChange={() => handleCheck(order.id)}
                                                                checked={checked.includes(order.id)}
                                                            />
                                                        </div>
                                                        <div className="OTRightCol noThumb"></div>
                                                    </div>
                                                    <div className="OTRow">
                                                        <div className="OTLeftCol">id</div>
                                                        <div className="OTRightCol">{order.paid > 0 ? 'WP' : 'R'}{order.id}</div>
                                                    </div>
                                                    <div className="OTRow">
                                                        <div className="OTLeftCol">Статус</div>
                                                        <div className="OTRightCol">
                                                            <span className={`OTStatus OTStatus${order.status}`}>
                                                                {statusArray2[order.status]}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="OTRow">
                                                        <div className="OTLeftCol">Клиент</div>
                                                        <div className="OTRightCol">{order.name}</div>
                                                    </div>
                                                    <div className="OTRow">
                                                        <div className="OTLeftCol">Трек</div>
                                                        <div className="OTRightCol">{order.track ? order.track : '‒'}</div>
                                                    </div>
                                                    <div className="OTRow">
                                                        <div className="OTLeftCol">Трек СДЭК</div>
                                                        <div className="OTRightCol">{order.sdek_track ? order.sdek_track : '‒'}</div>
                                                    </div>
                                                    <div className="OTRow">
                                                        <div className="OTLeftCol">Менеджер</div>
                                                        <div className="OTRightCol"><Manager order={order} /></div>
                                                    </div>
                                                    <div className="OTRow">
                                                        <div className="OTLeftCol">Сумма заказа</div>
                                                        <div className="OTRightCol">{FormatPrice.formatPrice(order.discount_cost)} ₽</div>
                                                    </div>
                                                    <div className="OTRow">
                                                        <div className="OTLeftCol">Дата</div>
                                                        <div className="OTRightCol">{formatDate(order.createdAt)}</div>
                                                    </div>
                                                    <div className="OTRow">
                                                        <div className="OTLeftCol">Сплит</div>
                                                        <div className="OTRightCol">
                                                            {order.is_split ?
                                                                (order.first_paid && order.second_paid ? '2/2' :
                                                                    (order.first_paid && !order.second_paid) || (!order.first_paid && order.second_paid) ? '1/2' :
                                                                        !order.first_paid && !order.second_paid && '0/2'
                                                                ) : '‒'}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </>
                                :
                                <div className="CRMOrdersEmpty">Заказы не найдены</div>
                            }
                        </>
                    }
                    {((ordersTab === 'work' && !orders.find(item => item.status !== 11)) || (ordersTab === 'canceled' && !orders.find(item => item.status === 11))) && !loading &&
                        <div className="CRMOrdersEmpty">Заказы не найдены</div>
                    }
                    {ordersTab === 'create' &&
                        <OrderCreate onCreate={setTabIn} />
                    }
                </>
            }
        </div>
    )
}