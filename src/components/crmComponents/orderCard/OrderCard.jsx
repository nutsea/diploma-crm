import React, { useEffect, useState } from "react";
import './OrderCard.scss'

import { IoIosArrowBack, IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { addItemToOrder, deleteOrderPhoto, fetchOrderItems, fetchOrderPhotos, setOrderPhoto, updateOrder, updateOrderItems } from "../../../http/orderAPI";
import { TbCopy, TbCopyCheckFilled } from "react-icons/tb";
import FormatPrice from "../../../utils/FormatPrice";
import { fetchUser } from "../../../http/userAPI";
import { fetchOneItemBySpu } from "../../../http/itemAPI";
import close from '../../../assets/close4.svg'
import close2 from '../../../assets/close.svg'

const itemStatusArray = {
    1: 'Ожидает выкуп',
    2: 'Выкуплен',
    3: 'Получен трек',
    4: 'Принят на складе',
}

const statusArray = {
    0: 'В обработке',
    1: 'Принят',
    2: 'Выкуплен',
    3: 'Получен трек',
    4: 'Принят в Китае',
    5: 'Оформляется',
    6: 'Доставляется в Россию',
    7: 'Прибыл в Россию',
    8: 'Передан в СДЭК',
    9: 'Выполнен',
    10: 'Требует уточнений',
    11: 'Отменен'
}

export const OrderCard = ({ order, onBack, onSave, onUser }) => {
    const [loading, setLoading] = useState(true)
    const [orderItems, setOrderItems] = useState([])
    const [listOpen, setListOpen] = useState(false)
    const [statusListsOpen, setStatusListsOpen] = useState([])
    const [orderStatusListOpen, setOrderStatusListOpen] = useState(false)
    const [itemsStatuses, setItemsStatuses] = useState([])
    const [status, setStatus] = useState(0)
    const [recipient, setRecipient] = useState('')
    const [phone, setPhone] = useState('')
    const [orderNums, setOrderNums] = useState([])
    const [tracks, setTracks] = useState([])
    const [shipType, setShipType] = useState('')
    const [comment, setComment] = useState('')
    const [manager, setManager] = useState('')
    const [address, setAddress] = useState('')
    const [track, setTrack] = useState('')
    const [cdekTrack, setCdekTrack] = useState('')
    const [dimensions, setDimensions] = useState('')
    const [cargoCost, setCargoCost] = useState('')
    const [cdekCost, setCdekCost] = useState('')
    const [firstPay, setFirstPay] = useState('')
    const [secondPay, setSecondPay] = useState('')
    const [firstPaid, setFirstPaid] = useState(false)
    const [secondPaid, setSecondPaid] = useState(false)
    const [paid, setPaid] = useState('')
    const [photoBuy, setPhotoBuy] = useState(null)
    const [photoStock, setPhotoStock] = useState(null)
    const [photos, setPhotos] = useState([])
    const [uidAdd, setUidAdd] = useState('')
    const [sizeAdd, setSizeAdd] = useState('')
    const [uidItem, setUidItem] = useState(null)
    const [uidPrice, setUidPrice] = useState('')
    const [uidDelivery, setUidDelivery] = useState('')
    const [uidFee, setUidFee] = useState('')
    const [orderAllow, setOrderAllow] = useState(true)
    const [checkedPrice, setCheckedPrice] = useState(false)
    const [priceCNY, setPriceCNY] = useState(0)
    const [priceRUB, setPriceRUB] = useState(0)
    const [fee, setFee] = useState(0)
    const [cost, setCost] = useState(0)
    const [socialMediaType, setSocialMediaType] = useState('VK')
    const [socialMedia, setSocialMedia] = useState('')
    const [deliveryCost, setDeliveryCost] = useState(0)
    const [modalReport, setModalReport] = useState('')
    const [openedItem, setOpenedItem] = useState(-1)
    const [copied, setCopied] = useState(false)
    const handleCopy = async (item) => {
        await navigator.clipboard.writeText(item.item_uid)
        setCopied(true)
        setTimeout(() => {
            setCopied(false)
        }, 1000)
    }

    const handleBack = () => {
        onBack()
    }

    const findOrder = async () => {
        await fetchOrderItems(order.id).then(data => {
            setOrderItems(data)
            setLoading(false)
            setOrderNums(data.map(item => item.order_num))
            setTracks(data.map(item => item.track))
            setStatusListsOpen(data.map(() => false))
            setItemsStatuses(data.map(item => item.status))
            setPriceCNY(data.map(item => item.cny_cost))
            setPriceRUB(data.map(item => item.rub_cost))
        })
        await fetchOrderPhotos(order.id).then(data => {
            setPhotos(data)
        })
    }

    const handleChangeNum = (e, i) => {
        let newNums = [...orderNums]
        newNums[i] = e.target.value
        setOrderNums(newNums)
    }

    const handleChangeTrack = (e, i) => {
        let newTracks = [...tracks]
        newTracks[i] = e.target.value
        setTracks(newTracks)
    }

    const handleChangePriceCNY = (e, i) => {
        let newPrices = [...priceCNY]
        newPrices[i] = e.target.value
        setPriceCNY(newPrices)
        let newPricesRub = [...priceRUB]
        newPricesRub[i] = Math.ceil(e.target.value * order.course)
        setPriceRUB(newPricesRub)
    }

    const handleFindUid = async () => {
        if (!uidAdd) return
        await fetchOneItemBySpu(uidAdd).then(data => {
            setUidItem(data)
        })
    }

    const findManager = async () => {
        await fetchUser(order.manager).then(data => {
            if (data && data.name)
                setManager(data.name)
        })
    }

    const formatDate = (date) => {
        const newDate = new Date(date);
        const day = newDate.getDate().toString().padStart(2, '0');
        const month = (newDate.getMonth() + 1).toString().padStart(2, '0');
        const year = newDate.getFullYear().toString();
        return `${day}.${month}.${year}`;
    }

    const handleStatusListsOpen = (i) => {
        let newStatusListsOpen = [...statusListsOpen]
        newStatusListsOpen[i] = !newStatusListsOpen[i]
        setStatusListsOpen(newStatusListsOpen)
    }

    const handleStatusesChange = (i, status) => {
        let newItemsStatuses = [...itemsStatuses]
        newItemsStatuses[i] = status
        setItemsStatuses(newItemsStatuses)
    }

    const handleSave = async () => {
        const promises = []

        const updateItems = await updateOrderItems(orderItems.map(item => item.id), itemsStatuses, orderNums, tracks, priceCNY, priceRUB)

        promises.push(updateItems)

        if (photoBuy) {
            for (let i of photoBuy) {
                const sendPhotoBuy = await setOrderPhoto(order.id, 'buy', i)
                promises.push(sendPhotoBuy)
            }
        }
        if (photoStock) {
            for (let i of photoStock) {
                const sendPhotoStock = await setOrderPhoto(order.id, 'stock', i)
                promises.push(sendPhotoStock)
            }
        }

        Promise.all(promises).then(async () => {
            await updateOrder(order.id, status, recipient, phone, shipType, comment, address, track, cdekTrack, dimensions, cargoCost, cdekCost, firstPay, secondPay, firstPaid, secondPaid, paid, orderAllow, fee, cost, socialMediaType, socialMedia, deliveryCost).then(data => {
                onSave()
                window.scrollTo({
                    top: 150,
                    behavior: 'smooth'
                })
                setPhotoBuy(null)
                setPhotoStock(null)
            })
        })
    }

    const handleItemToOrder = async () => {
        if (!uidItem.name || !sizeAdd || !uidPrice) return
        await addItemToOrder(order.id, uidItem.item_uid, uidItem.img[0].img, uidItem.name, uidItem.category, sizeAdd.size, orderItems[0].ship, sizeAdd.price / 100, uidPrice, uidDelivery, uidFee)
        setUidAdd('')
        setUidItem([])
        setUidPrice('')
        setUidDelivery('')
        setUidFee('')
        setSizeAdd('')
        onSave()
    }

    const handleChangeNumberInput = (e) => {
        e.target.value = e.target.value.replace(/\D/g, '')
        switch (e.target.name) {
            case 'firstPay':
                setFirstPay(e.target.value)
                break
            case 'secondPay':
                setSecondPay(e.target.value)
                break
            case 'paid':
                setPaid(e.target.value)
                break
            case 'cargoCost':
                setCargoCost(e.target.value)
                break
            case 'cdekCost':
                setCdekCost(e.target.value)
                break
            case 'uidPrice':
                setUidPrice(e.target.value)
                break
            case 'uidDelivery':
                setUidDelivery(e.target.value)
                break
            case 'uidFee':
                setUidFee(e.target.value)
                break
            case 'phone':
                if (e.target.value.length > 11) {
                    e.target.value = e.target.value.slice(0, 11)
                }
                setPhone(e.target.value)
                break
            case 'fee':
                setFee(e.target.value)
                break
            case 'cost':
                setCost(e.target.value)
                break
            default:
                break
        }
    }

    const deletePhoto = async (id) => {
        console.log(id)
        await deleteOrderPhoto(id).then(async () => {
            await fetchOrderPhotos(order.id).then(data => {
                setPhotos(data)
            })
        })
    }

    useEffect(() => {
        findOrder()
        setStatus(order.status)
        setRecipient(order.recipient)
        setPhone(order.phone)
        setShipType(order.ship_type)
        setComment(order.comment)
        setAddress(order.address)
        setTrack(order.track)
        setCdekTrack(order.sdek_track)
        setDimensions(order.dimensions)
        setCargoCost(order.cargo_cost)
        setCdekCost(order.sdek_cost)
        setFirstPay(order.first_pay)
        setSecondPay(order.second_pay)
        setFirstPaid(order.first_paid)
        setSecondPaid(order.second_paid)
        setPaid(order.paid)
        setOrderAllow(order.can_review)
        setCheckedPrice(order.checked_price)
        setFee(order.fee)
        setCost(order.cost)
        setSocialMediaType(order.social_media_type)
        setSocialMedia(order.social_media)
        setDeliveryCost(order.delivery_cost)
        if (order.manager)
            findManager()
        // eslint-disable-next-line 
    }, [order])

    useEffect(() => {
        handleFindUid()
        // eslint-disable-next-line 
    }, [uidAdd])

    useEffect(() => {
        console.log(paid)
    }, [paid])

    useEffect(() => {
        console.log(photoBuy)
    }, [photoBuy])

    return (
        <div className="CRMOrderCard">
            {modalReport &&
                <div
                    className="POSliderModal"
                    onClick={(e) => {
                        if (!e.target.closest('.POSliderBox')) {
                            setModalReport('')
                        }
                    }}
                >
                    <div className="POSliderBox">
                        <img className="POSliderImg" src={modalReport} alt="" />
                        <img
                            className="POSliderClose"
                            src={close2}
                            alt=""
                            onClick={() => {
                                setModalReport('')
                            }}
                        />
                    </div>
                </div>
            }
            {loading ?
                <div className="LoaderBox2">
                    <div className="Loader"></div>
                </div>
                :
                <>
                    <div className="CRMBack" onClick={handleBack}>
                        <IoIosArrowBack size={14} />
                        <span className="CRMBackText">Все заказы</span>
                    </div>
                    <div className="CRMOrderMobileBox">
                        <div className="CRMOrderCardNum">Заказ {order.paid > 0 ? 'WP' : 'R'}{order.id}</div>
                        <div className="CRMOrdersNotAllow">
                            <input type="checkbox" checked={orderAllow} onChange={() => setOrderAllow(!orderAllow)} />
                            <span>Разрешить оставлять отзыв</span>
                        </div>
                        <div className="OrderCardLineBeforeSub"></div>
                        <div className="CRMOrderCardSub">1. Основное</div>
                        <div className="OrderCardLineBeforeSub"></div>
                        <div className="CRMOrderCardRow">
                            <div className="CRMOrderCardCol">
                                <div className="CRMOrderInputBox">
                                    <div className="CRMOrderCardTip">Имя клиента</div>
                                    <div className="CRMOrderCardInfo CRMOrderCardLink" onClick={() => onUser(order.client_id)}>{order.name ? order.name : order.recipient}</div>
                                </div>
                                {/* <div className="CRMOrderInputBox">
                                    <div className="CRMOrderCardTip">VK</div>
                                    <input className={`CRMOrderCardInput ${socialMedia && socialMedia.length > 0 ? '' : 'CursorBorderInput'}`} value={socialMedia} onChange={(e) => setSocialMedia(e.target.value)} />
                                </div>
                                <div className="CRMOrderInputBox">
                                    <div className="CRMOrderCardTip">Telegram</div>
                                    <input className={`CRMOrderCardInput ${socialMediaType && socialMediaType.length > 0 ? '' : 'CursorBorderInput'}`} value={socialMediaType} onChange={(e) => setSocialMediaType(e.target.value)} />
                                </div> */}
                                <div className="CRMOrderInputBox">
                                    <div className="CRMOrderCardTip">Статус</div>
                                    <div className="CRMOrderInputCol">
                                        <div className="OrderSelect" onClick={() => setOrderStatusListOpen(!orderStatusListOpen)}>
                                            <span>{statusArray[status]}</span>
                                            {orderStatusListOpen ?
                                                <IoIosArrowUp size={14} />
                                                :
                                                <IoIosArrowDown size={14} />
                                            }
                                            {orderStatusListOpen &&
                                                <div className="OrderSelectList">
                                                    <div className="OrderSelectItem" onClick={() => setStatus(0)}>В обработке</div>
                                                    <div className="OrderSelectItem" onClick={() => setStatus(1)}>Принят</div>
                                                    <div className="OrderSelectItem" onClick={() => setStatus(2)}>Выкуплен</div>
                                                    <div className="OrderSelectItem" onClick={() => setStatus(3)}>Получен трек</div>
                                                    <div className="OrderSelectItem" onClick={() => setStatus(4)}>Принят в Китае</div>
                                                    <div className="OrderSelectItem" onClick={() => setStatus(5)}>Оформляется</div>
                                                    <div className="OrderSelectItem" onClick={() => setStatus(6)}>Доставляется в Россию</div>
                                                    <div className="OrderSelectItem" onClick={() => setStatus(7)}>Прибыл в Россию</div>
                                                    <div className="OrderSelectItem" onClick={() => setStatus(8)}>Передан в СДЭК</div>
                                                    <div className="OrderSelectItem" onClick={() => setStatus(9)}>Выполнен</div>
                                                    <div className="OrderSelectItem" onClick={() => setStatus(10)}>Требует уточнений</div>
                                                    <div className="OrderSelectItem" onClick={() => setStatus(11)}>Отменен</div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                                {manager && order.manager &&
                                    <>
                                        <div className="CRMOrderInputBox">
                                            <div className="CRMOrderCardTip">Принял</div>
                                            <div className="CRMOrderCardInfo">{manager}</div>
                                        </div>
                                    </>
                                }
                                {!manager && order.manager &&
                                    <>
                                        <div className="CRMOrderInputBox">
                                            <div className="CRMOrderCardTip">Принял</div>
                                            <div className="CRMOrderCardInfo">Без имени</div>
                                        </div>
                                    </>
                                }
                            </div>
                            <div className="CRMOrderCardCol">
                                <div className="CRMOrderInputBox">
                                    <div className="CRMOrderCardTip">Дата создания</div>
                                    <div className="CRMOrderCardInfo">{formatDate(order.createdAt)}</div>
                                </div>
                                <div className="CRMOrderInputBox">
                                    <div className="CRMOrderCardTip">Отчет о выкупе</div>
                                    <div className="CRMOrderCardPhotoRow">
                                        <div className="CRMOrderCardPhotoInput">
                                            <span>Добавить фото</span>
                                            <input type="file" accept="image/*" multiple="true" id="buyfile" onChange={(e) => setPhotoBuy(Array.from(e.target.files))} />
                                        </div>
                                        {photoBuy && photoBuy.length > 0 &&
                                            <>
                                                <div className="CRMOrderCardTipPhoto">Выбранные фото</div>
                                                <div className="CRMOrderCardOldPhotoRow">
                                                    {photoBuy.map((img, i) => {
                                                        return (
                                                            <div className="CRMOrderCardOldPhotoRowOne">
                                                                <img src={close} alt=""
                                                                    className="PhotoRemoveBtn"
                                                                    onClick={() => {
                                                                        setPhotoBuy(photoBuy.filter((item, index) => index !== i))
                                                                    }}
                                                                />
                                                                <img
                                                                    className="CRMOrderImg"
                                                                    key={i}
                                                                    src={URL.createObjectURL(img)}
                                                                    alt="Выбранное фото"
                                                                    onClick={() => {
                                                                        setModalReport(URL.createObjectURL(img))
                                                                    }}
                                                                />
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </>
                                        }
                                        {photos && photos.length > 0 && photos.find(img => img.type === 'buy') &&
                                            <>
                                                <div className="CRMOrderCardTipPhoto">Ранее добавленные фото</div>
                                                <div className="CRMOrderCardOldPhotoRow">
                                                    {photos.map((img, i) => {
                                                        if (img.type === 'buy')
                                                            return (
                                                                <div className="CRMOrderCardOldPhotoRowOne">
                                                                    <img src={close} alt=""
                                                                        className="PhotoRemoveBtn"
                                                                        onClick={() => {
                                                                            deletePhoto(img.id)
                                                                        }}
                                                                    />
                                                                    <img
                                                                        className="CRMOrderImg"
                                                                        key={i}
                                                                        src={process.env.REACT_APP_IMG_URL + img.img}
                                                                        alt="Выбранное фото"
                                                                        onClick={() => {
                                                                            setModalReport(process.env.REACT_APP_IMG_URL + img.img)
                                                                        }}
                                                                    />
                                                                </div>
                                                            )
                                                        else return null
                                                    })}
                                                </div>
                                                {/* <div
                                                className="POSliderModal"
                                                onClick={(e) => {
                                                    if (!e.target.closest('.POSliderBox')) {
                                                        setModalReport('')
                                                        setModalReportType('')
                                                    }
                                                }}
                                            >
                                                <div className="POSliderBox">
                                                    <OrderSlider item={order.buyReport} num={modalReportNum} />
                                                    <img
                                                        className="POSliderClose"
                                                        src={close2}
                                                        alt=""
                                                        onClick={() => {
                                                            setModalReport('')
                                                            setModalReportType('')
                                                        }}
                                                    />
                                                </div>
                                            </div> */}
                                            </>
                                        }
                                    </div>
                                </div>
                                <div className="CRMOrderInputBox">
                                    <div className="CRMOrderCardTip">Фото отчет</div>
                                    <div className="CRMOrderCardPhotoRow">
                                        <div className="CRMOrderCardPhotoInput">
                                            <span>Добавить фото</span>
                                            <input type="file" accept="image/*" multiple="true" id="buyfile" onChange={(e) => setPhotoStock(Array.from(e.target.files))} />
                                        </div>
                                        {photoStock && photoStock.length > 0 &&
                                            <>
                                                <div className="CRMOrderCardTipPhoto">Выбранные фото</div>
                                                <div className="CRMOrderCardOldPhotoRow">
                                                    {photoStock.map((img, i) => {
                                                        return (
                                                            <div className="CRMOrderCardOldPhotoRowOne">
                                                                <img src={close} alt=""
                                                                    className="PhotoRemoveBtn"
                                                                    onClick={() => {
                                                                        setPhotoStock(photoStock.filter((item, index) => index !== i))
                                                                    }}
                                                                />
                                                                <img
                                                                    className="CRMOrderImg"
                                                                    key={i}
                                                                    src={URL.createObjectURL(img)}
                                                                    alt="Выбранное фото"
                                                                    onClick={() => {
                                                                        setModalReport(URL.createObjectURL(img))
                                                                    }}
                                                                />
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </>
                                        }
                                        {photos && photos.length > 0 && photos.find(img => img.type === 'stock') &&
                                            <>
                                                <div className="CRMOrderCardTipPhoto">Ранее добавленные фото</div>
                                                <div className="CRMOrderCardOldPhotoRow">
                                                    {photos.map((img, i) => {
                                                        if (img.type === 'stock')
                                                            return (
                                                                <div className="CRMOrderCardOldPhotoRowOne">
                                                                    <img src={close} alt=""
                                                                        className="PhotoRemoveBtn"
                                                                        onClick={() => {
                                                                            deletePhoto(img.id)
                                                                        }}
                                                                    />
                                                                    <img
                                                                        className="CRMOrderImg"
                                                                        key={i}
                                                                        src={process.env.REACT_APP_IMG_URL + img.img}
                                                                        alt="Выбранное фото"
                                                                        onClick={() => {
                                                                            setModalReport(process.env.REACT_APP_IMG_URL + img.img)
                                                                        }}
                                                                    />
                                                                </div>
                                                            )
                                                        else return null
                                                    })}
                                                </div>
                                            </>
                                        }
                                    </div>
                                </div>
                                <div className="CRMOrderInputBox">
                                    <div className="CRMOrderCardTip">Комментарий</div>
                                    <input className={`CRMOrderCardInput ${comment && comment.length > 0 ? '' : 'CursorBorderInput'}`} value={comment} onChange={(e) => setComment(e.target.value)} />
                                </div>
                                {!checkedPrice &&
                                    <div className="CRMOrderCardNotChecked">Сбой проверки цены!</div>
                                }
                            </div>
                        </div>

                        <div className="OrderCardLineBeforeSub"></div>
                        <div className="CRMOrderCardSub">2. Логистика</div>
                        <div className="OrderCardLineBeforeSub"></div>
                        <div className="CRMOrderCardRow">
                            <div className="CRMOrderCardCol">
                                <div className="CRMOrderInputBox">
                                    <div className="CRMOrderCardTip">ФИО Получателя</div>
                                    <input className={`CRMOrderCardInput ${recipient && recipient.length > 0 ? '' : 'CursorBorderInput'}`} value={recipient} onChange={(e) => setRecipient(e.target.value)} />
                                </div>
                                <div className="CRMOrderInputBox">
                                    <div className="CRMOrderCardTip">Телефон получателя</div>
                                    <input className={`CRMOrderCardInput ${phone && phone.length > 0 ? '' : 'CursorBorderInput'}`} value={phone} name="phone" onChange={(e) => handleChangeNumberInput(e)} />
                                </div>
                                <div className="CRMOrderInputBox">
                                    <div className="CRMOrderCardTip">Адрес получателя</div>
                                    <textarea className={`CRMOrderCardInput ${address && address.length > 0 ? '' : 'CursorBorderInput'}`} value={address} onChange={(e) => setAddress(e.target.value)} />
                                </div>
                                <div className="CRMOrderInputBox">
                                    <div className="CRMOrderCardTip">Доставка</div>
                                    <div className="OrderSelect" onClick={() => setListOpen(!listOpen)}>
                                        <span>{shipType === 'home' ? 'Курьер' : (shipType === 'point') && 'Пункт выдачи'}</span>
                                        {listOpen ?
                                            <IoIosArrowUp size={14} />
                                            :
                                            <IoIosArrowDown size={14} />
                                        }
                                        {listOpen &&
                                            <div className="OrderSelectList">
                                                <div className="OrderSelectItem" onClick={() => setShipType('home')}>Курьер</div>
                                                <div className="OrderSelectItem" onClick={() => setShipType('point')}>Пункт выдачи</div>
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className="CRMOrderInputBox">
                                    <div className="CRMOrderCardTip">Трек СДЭК</div>
                                    <input className={`CRMOrderCardInput ${cdekTrack && cdekTrack.length > 0 ? '' : 'CursorBorderInput'}`} value={cdekTrack} onChange={(e) => setCdekTrack(e.target.value)} />
                                </div>
                            </div>
                            <div className="CRMOrderCardCol">
                                <div className="CRMOrderInputBox">
                                    <div className="CRMOrderCardTip">Трек</div>
                                    <input className={`CRMOrderCardInput ${track && track.length > 0 ? '' : 'CursorBorderInput'}`} value={track} onChange={(e) => setTrack(e.target.value)} />
                                </div>
                                <div className="CRMOrderInputBox">
                                    <div className="CRMOrderCardTip">Габариты</div>
                                    <input className={`CRMOrderCardInput ${dimensions && dimensions.length > 0 ? '' : 'CursorBorderInput'}`} value={dimensions} onChange={(e) => setDimensions(e.target.value)} />
                                </div>
                                <div className="CRMOrderInputBox">
                                    <div className="CRMOrderCardTip">Стоимость карго</div>
                                    <input className={`CRMOrderCardInput ${cargoCost && cargoCost.length > 0 ? '' : 'CursorBorderInput'}`} value={cargoCost} name="cargoCost" onChange={(e) => handleChangeNumberInput(e)} />
                                </div>
                                <div className="CRMOrderInputBox">
                                    <div className="CRMOrderCardTip">Стоимость СДЭК</div>
                                    <input className={`CRMOrderCardInput ${cdekCost && cdekCost.length > 0 ? '' : 'CursorBorderInput'}`} value={cdekCost} name="cdekCost" onChange={(e) => handleChangeNumberInput(e)} />
                                </div>
                                {(order.cargo_cost > 0 && order.sdek_cost > 0) &&
                                    <div className="CRMOrderInputBox">
                                        <div className="CRMOrderCardTip">Итоговая себестоимость доставки</div>
                                        <div className="CRMOrderCardInfo">{order.cargo_cost + order.sdek_cost} ₽</div>
                                    </div>
                                }
                                <div className="CRMOrderInputBox">
                                    <div className="CRMOrderCardTip">Стоимость доставки</div>
                                    <input className={`CRMOrderCardInput ${deliveryCost ? '' : 'CursorBorderInput'}`} value={deliveryCost} onChange={(e) => setDeliveryCost(e.target.value)} />
                                </div>
                            </div>
                        </div>

                        <div className="OrderCardLineBeforeSub"></div>
                        <div className="CRMOrderCardSub">3. Оплата</div>
                        <div className="OrderCardLineBeforeSub"></div>
                        <div className="CRMOrderCardRow">
                            <div className="CRMOrderCardCol">
                                <div className="CRMOrderInputBox">
                                    <div className="CRMOrderCardTip">Оплата</div>
                                    <div className="CRMOrderCardInfo">{order.is_split ? 'Сплит' : 'Полная'}</div>
                                </div>
                                {order.is_split &&
                                    <>
                                        <div className="CRMOrderInputBox">
                                            <div className="CRMOrderCardTip">Первый платеж</div>
                                            <div className="CRMOrderCardPayment">
                                                <input className="CRMOrderCardPaymentCheck" type="checkbox" checked={firstPaid} onChange={() => setFirstPaid(!firstPaid)} />
                                                <input className={`CRMOrderCardInput ${firstPay ? '' : 'CursorBorderInput'}`} value={firstPay} name="firstPay" onChange={(e) => handleChangeNumberInput(e)} />
                                            </div>
                                        </div>
                                        <div className="CRMOrderInputBox">
                                            <div className="CRMOrderCardTip">Второй платеж</div>
                                            <div className="CRMOrderCardPayment">
                                                <input className="CRMOrderCardPaymentCheck" type="checkbox" checked={secondPaid} onChange={() => setSecondPaid(!secondPaid)} />
                                                <input className={`CRMOrderCardInput ${secondPay ? '' : 'CursorBorderInput'}`} value={secondPay} name="secondPay" onChange={(e) => handleChangeNumberInput(e)} />
                                            </div>
                                        </div>
                                    </>
                                }
                                <div className="CRMOrderInputBox">
                                    <div className="CRMOrderCardTip">Оплачено</div>
                                    <input className={`CRMOrderCardInput ${paid ? '' : 'CursorBorderInput'}`} value={paid} name="paid" onChange={(e) => handleChangeNumberInput(e)} />
                                </div>
                            </div>
                            <div className="CRMOrderCardCol">
                                <div className="CRMOrderInputBox">
                                    <div className="CRMOrderCardTip">Курс</div>
                                    <div className="CRMOrderCardInfo">{order.course} ₽</div>
                                </div>
                                <div className="CRMOrderInputBox">
                                    <div className="CRMOrderCardTip">Комиссия</div>
                                    <input className={`CRMOrderCardInput ${fee ? '' : 'CursorBorderInput'}`} value={fee} name="fee" onChange={(e) => handleChangeNumberInput(e)} />
                                </div>
                                <div className="CRMOrderInputBox">
                                    <div className="CRMOrderCardTip">Стоимость заказа</div>
                                    <input className={`CRMOrderCardInput ${cost ? '' : 'CursorBorderInput'}`} value={cost} name="cost" onChange={(e) => handleChangeNumberInput(e)} />
                                </div>
                                {order.promo &&
                                    <>
                                        <div className="CRMOrderInputBox">
                                            <div className="CRMOrderCardTip">Промокод</div>
                                            <div className="CRMOrderCardInfo">{order.promo}</div>
                                        </div>
                                        <div className="CRMOrderInputBox">
                                            <div className="CRMOrderCardTip">Скидка</div>
                                            <div className="CRMOrderCardInfo">{FormatPrice.formatPrice(order.discount)} ₽</div>
                                        </div>
                                        <div className="CRMOrderInputBox">
                                            <div className="CRMOrderCardTip">Стоимость заказа со скидкой</div>
                                            <div className="CRMOrderCardInfo">{FormatPrice.formatPrice(order.discount_cost)} ₽</div>
                                        </div>
                                    </>
                                }
                            </div>
                        </div>

                        <div className="OrderCardLineBeforeSub"></div>
                        <div className="CRMOrderCardSub">4. Позиции заказа:</div>
                        <div className="OrderCardLineBeforeSub"></div>
                        {itemsStatuses.length > 0 && orderNums.length > 0 && tracks.length > 0 && statusListsOpen.length > 0 &&
                            <>
                                <div className="CRMOrderCardItemsTable">
                                    <table>
                                        <thead>
                                            <tr>
                                                <td>Наименование</td>
                                                <td>Статус</td>
                                                <td>Размер</td>
                                                <td>Цена CNY</td>
                                                <td>Цена RUB</td>
                                                <td>Номер заказа</td>
                                                <td>Трек-номер</td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orderItems.map((item, i) => {
                                                return (
                                                    <tr key={i}>
                                                        <td>
                                                            <div>{item.name}</div>
                                                            {/* <div className="OrderCardTableId">{item.item_uid}</div> */}
                                                            <div className="CRMItemUid OrderUid noThumb" onClick={() => handleCopy(item)}>
                                                                {item.item_uid}
                                                                {copied ?
                                                                    <TbCopyCheckFilled className="CRMItemCopyIcon" style={{ pointerEvents: 'none' }} />
                                                                    :
                                                                    <TbCopy className="CRMItemCopyIcon" style={{ pointerEvents: 'none' }} />
                                                                }
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="OrderItemSelect" onClick={() => handleStatusListsOpen(i)}>
                                                                <span>{itemStatusArray[itemsStatuses[i]]}</span>
                                                                {statusListsOpen[i] ?
                                                                    <IoIosArrowUp size={14} />
                                                                    :
                                                                    <IoIosArrowDown size={14} />
                                                                }
                                                                {statusListsOpen[i] &&
                                                                    <div className="OrderItemSelectListSmall">
                                                                        <div className="OrderItemSelectItem" onClick={() => handleStatusesChange(i, 1)}>Ожидает выкуп</div>
                                                                        <div className="OrderItemSelectItem" onClick={() => handleStatusesChange(i, 2)}>Выкуплен</div>
                                                                        <div className="OrderItemSelectItem" onClick={() => handleStatusesChange(i, 3)}>Получен трек</div>
                                                                        <div className="OrderItemSelectItem" onClick={() => handleStatusesChange(i, 4)}>Принят на складе</div>
                                                                    </div>
                                                                }
                                                            </div>
                                                        </td>
                                                        <td>{item.size}</td>
                                                        <td><input className="CRMOrderItemInput" value={priceCNY[i]} onChange={(e) => handleChangePriceCNY(e, i)} /></td>
                                                        <td>{priceRUB[i]}</td>
                                                        <td><input className="CRMOrderItemInput CRMOrderItemInputNumber" value={orderNums[i]} onChange={(e) => handleChangeNum(e, i)} /></td>
                                                        <td><input className="CRMOrderItemInput CRMOrderItemInputTrack" value={tracks[i]} onChange={(e) => handleChangeTrack(e, i)} /></td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="CRMOrderItemsList">
                                    {orderItems.map((item, i) => {
                                        return (
                                            <div className="CRMOrderItemsListOne">
                                                <div className="CRMOrderCardTip2">Наименование товара:</div>
                                                <div
                                                    className="CRMOrderCardName"
                                                    onClick={() => {
                                                        if (openedItem === i) setOpenedItem(-1)
                                                        else setOpenedItem(i)
                                                    }}
                                                >
                                                    <span>{i + 1}. {item.name}</span>
                                                    {openedItem === i ?
                                                        <IoIosArrowUp size={14} />
                                                        :
                                                        <IoIosArrowDown size={14} />
                                                    }
                                                </div>
                                                <div className="CRMItemUid noThumb" onClick={() => handleCopy(item)}>
                                                    {item.item_uid}
                                                    {copied ?
                                                        <TbCopyCheckFilled className="CRMItemCopyIcon" style={{ pointerEvents: 'none' }} />
                                                        :
                                                        <TbCopy className="CRMItemCopyIcon" style={{ pointerEvents: 'none' }} />
                                                    }
                                                </div>
                                                {openedItem === i &&
                                                    <>
                                                        <div className="CRMOrderCardTip2">Статус</div>
                                                        <div className="OrderItemSelect" onClick={() => handleStatusListsOpen(i)}>
                                                            <span>{itemStatusArray[itemsStatuses[i]]}</span>
                                                            {statusListsOpen[i] ?
                                                                <IoIosArrowUp size={14} />
                                                                :
                                                                <IoIosArrowDown size={14} />
                                                            }
                                                            {statusListsOpen[i] &&
                                                                <div className="OrderItemSelectListSmall">
                                                                    <div className="OrderItemSelectItem" onClick={() => handleStatusesChange(i, 1)}>Ожидает выкуп</div>
                                                                    <div className="OrderItemSelectItem" onClick={() => handleStatusesChange(i, 2)}>Выкуплен</div>
                                                                    <div className="OrderItemSelectItem" onClick={() => handleStatusesChange(i, 3)}>Получен трек</div>
                                                                    <div className="OrderItemSelectItem" onClick={() => handleStatusesChange(i, 4)}>Принят на складе</div>
                                                                </div>
                                                            }
                                                        </div>
                                                        <div className="CRMOrderCardTip2">Размер</div>
                                                        <div className="CRMOrderCardInfo2">{item.size}</div>
                                                        <div className="CRMOrderCardTip2">Цена CNY</div>
                                                        <input className="CRMOrderItemInput" value={priceCNY[i]} onChange={(e) => handleChangePriceCNY(e, i)} />
                                                        <div className="CRMOrderCardTip2">Цена RUB</div>
                                                        <div className="CRMOrderCardInfo2">{priceRUB[i]}</div>
                                                        <div className="CRMOrderCardTip2">Номер заказа</div>
                                                        <input className="CRMOrderItemInput CRMOrderItemInputNumber" value={orderNums[i]} onChange={(e) => handleChangeNum(e, i)} />
                                                        <div className="CRMOrderCardTip2">Трек-номер</div>
                                                        <input className="CRMOrderItemInput CRMOrderItemInputTrack" value={tracks[i]} onChange={(e) => handleChangeTrack(e, i)} />
                                                    </>
                                                }
                                            </div>
                                        )
                                    })}
                                </div>
                            </>
                        }
                        <input className={`CRMOrderCardInputUid ${uidAdd && uidAdd.length > 0 ? '' : 'CursorBorderInput'}`} value={uidAdd} onChange={(e) => setUidAdd(e.target.value)} placeholder="Введите id товара" />
                        {uidItem && uidItem.name ?
                            <>
                                <div className="CRMOrderCardItem NoBorderOrderItem">
                                    <img src={uidItem.img[0].img} alt="" />
                                    <div className="CRMOrderCardItemInfo">
                                        <div className="CRMOrderCardItemName">{uidItem.name}</div>
                                        {sizeAdd &&
                                            <div className="CRMOrderCardItemPrice Orange">{FormatPrice.formatPrice(sizeAdd.price / 100)} ¥</div>
                                        }
                                        {uidItem.sizes.length > 0 &&
                                            <div className="CRMOrderCardItemSize CRMFlexSizes">
                                                {uidItem.sizes && uidItem.sizes.map((size, i) => {
                                                    if (size.size_type === 'EU')
                                                        return (
                                                            <div key={i} className={`CRMOrderCardItemSizeBtn ${sizeAdd === size ? 'CRMChosenSize' : ''}`} onClick={() => setSizeAdd(size)}>{size.size} {uidItem.category === 'shoes' ? 'EU' : ''}</div>
                                                        )
                                                    else return null
                                                })}
                                            </div>
                                        }
                                    </div>
                                </div>
                                <input className={`CRMOrderCardInputUid ${uidPrice && uidPrice.length > 0 ? '' : 'CursorBorderInput'}`} value={uidPrice} name="uidPrice" onChange={(e) => handleChangeNumberInput(e)} placeholder="Цена" />
                                <input className={`CRMOrderCardInputUid ${uidDelivery && uidDelivery.length > 0 ? '' : 'CursorBorderInput'}`} value={uidDelivery} name="uidDelivery" onChange={(e) => handleChangeNumberInput(e)} placeholder="Стоимость доставки" />
                                <input className={`CRMOrderCardInputUid ${uidFee && uidFee.length > 0 ? '' : 'CursorBorderInput'}`} value={uidFee} name="uidFee" onChange={(e) => handleChangeNumberInput(e)} placeholder="Комиссия" />
                            </>
                            : ((!uidItem || !uidItem.name) && uidAdd) &&
                            <div className="CRMOrderItemNotFound">Товар не найден</div>
                        }
                        <div className={`CRMOrderCardAddItems ${uidItem && uidItem.name && sizeAdd && uidPrice ? 'Active' : ''}`} onClick={handleItemToOrder}>Добавить товар</div>
                    </div>
                    <div className="CRMOrderCardSaveBtn" onClick={handleSave}>Сохранить</div>
                </>
            }
        </div>
    )
}