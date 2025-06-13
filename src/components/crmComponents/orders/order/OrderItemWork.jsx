import React, { useEffect, useState } from "react";
import FormatPrice from "../../../../utils/FormatPrice";
import { fetchUser } from "../../../../http/userAPI";

import fastShip from '../../../../assets/fastShip.svg';

const statusArray = {
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

export const OrderItemWork = ({ order, orderType, isHovered, position }) => {
    const [manager, setManager] = useState('')

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

    const findManager = async () => {
        await fetchUser(order.manager).then(data => {
            if (data && data.name)
                setManager(data.name)
        })
    }

    useEffect(() => {
        if (order.manager) {
            findManager()
        }
        // eslint-disable-next-line
    }, [order])

    return (
        <>
            <td>
                <div className={`OrderTableItemShip ${order.ship === 'fast' ? 'Fast' : ''}`}>
                    {order.ship === 'fast' &&
                        <img src={fastShip} alt="Экспресс" />
                    }
                    {order.paid > 0 ? 'WP' : 'R'}
                    {order.id}
                </div>
            </td>
            <td>
                <span className={`OTStatus OTStatus${order.status}`}>
                    {statusArray[order.status]}
                </span>
            </td>
            <td className="CRMOrderRecipient">{order.name}</td>
            <td className="CRMOrdersPhone">{order.track ? order.track : '‒'}</td>
            <td className="CRMOrdersPhone">{order.sdek_track ? order.sdek_track : '‒'}</td>
            <td className="CRMOrdersPhone">{manager && order.manager ? manager : (!manager && order.manager) ? 'Без имени' : '‒'}</td>
            <td>{FormatPrice.formatPrice(order.discount_cost)} ₽</td>
            <td>{formatDate(order.createdAt)}</td>
            <td>
                <div className={`${order.first_paid && order.second_paid ? 'OrderItemTableSplitPaid' : ''}`}>
                    {order.is_split ?
                        (order.first_paid && order.second_paid ? '2/2' :
                            (order.first_paid && !order.second_paid) || (!order.first_paid && order.second_paid) ? '1/2' :
                                !order.first_paid && !order.second_paid && '0/2'
                        ) : '‒'}
                </div>
            </td>
            <td style={{ width: 0, padding: 0 }}>
                <div
                    className={`OrderThumbnail ${isHovered === order.id ? 'Active' : ''}`}
                    style={{ left: position.x + 10, top: position.y + 10 }}
                >
                    <div className="ThumbNumber">Заказ № {order.id}</div>
                    <div className="ThumbClient">
                        <span className="ThumbTip">Клиент: </span>
                        {order.name}
                    </div>
                    {order.social_media &&
                        <div className="ThumbTg">
                            <span className="ThumbTip">VK: </span>
                            {order.social_media}
                        </div>
                    }
                    {order.social_media_type &&
                        <div className="ThumbTg">
                            <span className="ThumbTip">Telegram: </span>
                            {order.social_media_type}
                        </div>
                    }
                    <div className="ThumbRecipient">
                        <span className="ThumbTip">Получатель: </span>
                        {order.recipient}
                    </div>
                    <div className="ThumbPhone">
                        <span className="ThumbTip">Телефон: </span>
                        {formatPhone(order.phone)}
                    </div>
                    <div className="OrderThumbLine"></div>
                    <div className="ThumbShip">
                        <span className="ThumbTip">Доставка: </span>
                        {order.ship_type === 'home' ? 'Курьер' : (order.ship_type === 'point') && 'Пункт выдачи'}
                    </div>
                    <div className="ThumbShip">
                        <span className="ThumbTip">Адрес: </span>
                        {order.address}
                    </div>
                    <div className="ThumbShip">
                        <span className="ThumbTip">Тип доставки: </span>
                        {order.ship === 'slow' ?
                            <span className="CRMOrdersSlow"> Стандарт</span>
                            : (order.ship === 'fast') &&
                            <span className="CRMOrdersFast"> Экспресс</span>
                        }
                    </div>
                    <div className="ThumbPayment">
                        <span className="ThumbTip">Оплата: </span>
                        {order.is_split ? 'Сплит' : 'Полная'}
                    </div>
                    <div className="OrderThumbLine"></div>
                    <div className="ThumbPayment">
                        <span className="ThumbTip">Сумма со скидкой: </span>
                        {FormatPrice.formatPrice(order.discount_cost)} ₽
                    </div>
                    <div className="ThumbPayment">
                        <span className="ThumbTip">Скидка: </span>
                        {FormatPrice.formatPrice(order.discount)} ₽
                    </div>
                    <div className="ThumbPayment">
                        <span className="ThumbTip">Стоимость доставки: </span>
                        {order.delivery_cost} ₽
                    </div>
                    <div className="ThumbPayment">
                        <span className="ThumbTip">Комиссия: </span>
                        {order.fee} ₽
                    </div>
                    <div className="ThumbPayment">
                        <span className="ThumbTip">Курс: </span>
                        {order.course} ₽
                    </div>
                </div>
            </td>
        </>
    )
}