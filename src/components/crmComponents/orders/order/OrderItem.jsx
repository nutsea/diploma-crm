import React from "react";
import FormatPrice from "../../../../utils/FormatPrice";

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

export const OrderItem = ({ order, orderType, isHovered, position, isUser }) => {

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

    return (
        <>
            <td>{order.paid > 0 ? 'WP' : 'R'}{order.id}</td>
            {isUser &&
                <td className="OTStatusBox">
                    <span className={`OTStatus OTStatus${order.status}`}>
                        {statusArray[order.status]}
                    </span>
                </td>
            }
            {!isUser &&
                <td>{order.name}</td>
            }
            <td className="CRMOrderRecipient">{order.recipient}</td>
            <td className="CRMOrdersPhone">{formatPhone(order.phone)}</td>
            <td>
                {order.ship_type === 'home' ? 'Курьер' : (order.ship_type === 'point') && 'Пункт выдачи'}
                {order.ship === 'slow' ?
                    <span className="CRMOrdersSlow"> Стандарт</span>
                    : (order.ship === 'fast') &&
                    <span className="CRMOrdersFast"> Экспресс</span>
                }
            </td>
            <td>{order.is_split ? 'Сплит' : 'Полная'}</td>
            <td>{FormatPrice.formatPrice(order.discount_cost)} ₽</td>
            <td>{FormatPrice.formatPrice(order.discount)} ₽</td>
            <td>{order.fee} ₽</td>
            <td>{order.course} ₽</td>
            {orderType === 'work' &&
                <td>{order.status}</td>
            }
            <td>{formatDate(order.createdAt)}</td>
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
                    {order.social_media && order.from !== 'site' &&
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
                    {(orderType === 'work' || isUser) &&
                        <>
                            <div className="OrderThumbLine"></div>
                            <div className="ThumbPayment">
                                <span className="ThumbTip">Статус: </span>
                                {statusArray[order.status]} ({order.status})
                            </div>
                        </>
                    }
                </div>
            </td>
        </>
    )
}