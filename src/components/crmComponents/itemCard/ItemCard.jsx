import React, { useContext, useEffect, useState } from "react";
import './ItemCard.scss';
import { deletePhoto, fetchOneItem } from "../../../http/itemAPI";
import FormatPrice from "../../../utils/FormatPrice";
import { Context } from "../../..";

import { IoIosArrowBack } from "react-icons/io";
import { TbCopy, TbCopyCheckFilled } from "react-icons/tb";
import { BsTrash3 } from "react-icons/bs";
import { observer } from "mobx-react-lite";

const genders = {
    1: 'унисекс',
    2: 'мужской',
    3: 'женский',
    4: 'ребенок',
    5: 'малыш',
    6: 'средний ребенок',
    7: 'старший ребенок'
}

export const ItemCard = observer(({ item, onBack }) => {
    const { constants } = useContext(Context)
    const [foundItem, setFoundItem] = useState()
    const [loading, setLoading] = useState(true)
    const [copied, setCopied] = useState(false)
    const [checkedImages, setCheckedImages] = useState([])
    const [isModal, setIsModal] = useState(false)

    const handleBack = () => {
        onBack()
    }

    function isValidSize(size) {
        return /^(\d+(\.\d+)?(\/\d+)?(\s\d\/\d)?)$/.test(size)
    }

    function convertSizeToNumeric(size) {
        size = size.replace(' 1/3', '.33').replace(' 2/3', '.67').replace(' 1/2', '.5').replace(' 1/4', '.25').replace(' 3/4', '.75')
        return parseFloat(size)
    }

    function replaceSize(size) {
        return size.replace(' 1/2', '½').replace(' 2/3', '⅔').replace(' 1/3', '⅓').replace(' 1/4', '¼').replace(' 3/4', '¾')
    }

    function sortItemsBySize(items) {
        const sizeOrder = ["xxxxs", "xxxs", "xxs", "xs", "s", "m", "l", "xl", "xxl", "xxxl", "xxxxl", "xxxxxl"]

        function getNumericValue(size) {
            return convertSizeToNumeric(size)
        }

        function getSizeOrder(size) {
            return sizeOrder.indexOf(size.toLowerCase())
        }

        function isInSizeOrder(size) {
            return sizeOrder.includes(size.toLowerCase())
        }

        let numericItems = items.filter(item => isValidSize(item.size))
        let validLetterItems = items.filter(item => !isValidSize(item.size) && isInSizeOrder(item.size))
        const invalidLetterItems = items.filter(item => !isValidSize(item.size) && !isInSizeOrder(item.size))

        numericItems = numericItems.sort((a, b) => getNumericValue(a.size) - getNumericValue(b.size))

        validLetterItems = validLetterItems.sort((a, b) => getSizeOrder(a.size) - getSizeOrder(b.size))

        return numericItems.concat(validLetterItems).concat(invalidLetterItems)
    }

    const findItem = () => {
        setLoading(true)
        fetchOneItem(item.id).then((data) => {
            setFoundItem(data)
            setLoading(false)
        })
    }

    const handleCopy = async () => {
        await navigator.clipboard.writeText(item.item_uid)
        setCopied(true)
        setTimeout(() => {
            setCopied(false)
        }, 1000)
    }

    const formatDate = (date) => {
        const newDate = new Date(date);
        const day = newDate.getDate().toString().padStart(2, '0');
        const month = (newDate.getMonth() + 1).toString().padStart(2, '0');
        const year = newDate.getFullYear().toString();
        return `${day}.${month}.${year}`;
    }

    const handleCheckImage = (id) => {
        if (checkedImages.includes(id)) {
            setCheckedImages(checkedImages.filter(item => item !== id))
        } else {
            setCheckedImages([...checkedImages, id])
        }
    }

    const deleteImages = () => {
        setIsModal(false)
        const promise = checkedImages.map(async img => {
            return await deletePhoto(img)
        })
        Promise.all(promise).then(() => {
            findItem()
            setCheckedImages([])
        })
    }

    const findSizeType = (type) => {
        if (foundItem && foundItem.sizes && foundItem.sizes.length > 0) {
            const size = foundItem.sizes.find(item => item.size_type.startsWith(type))
            if (size) {
                return true
            } else {
                return false
            }
        }
    }

    const getPrioritySizeCell = (type, sizeDefault, sizes) => {
        const priorities = [1, 2, 3]
        for (const num of priorities) {
            const sizeObj = sizes.find(item =>
                item.size_default === sizeDefault &&
                item.size_type === `${type}_${num}`
            )
            if (sizeObj) return <td>{sizeObj.size}</td>
        }
        return <td>/</td>
    }

    useEffect(() => {
        findItem()
        // eslint-disable-next-line
    }, [])

    return (
        <div className="CRMItemCard">
            {loading ?
                <div className="LoaderBox2">
                    <div className="Loader"></div>
                </div>
                :
                <>
                    <div className="CRMBack" onClick={handleBack}>
                        <IoIosArrowBack size={14} />
                        <span className="CRMBackText">Назад</span>
                    </div>
                    <div className="CRMItemCardBrand">{item.brand}</div>
                    <div className="CRMItemCardName">{item.name}</div>
                    <div className="CRMItemCardModel">{item.model}</div>
                    <div className="CRMItemCardModel">Пол: {item.fitId ? (genders[item.fitId] ? genders[item.fitId] : 'не определён') : 'не определён'}</div>
                    <div className="CRMItemCardUid" onClick={handleCopy}>
                        {item.item_uid}
                        {copied ?
                            <TbCopyCheckFilled className="CRMItemCopyIcon" style={{ pointerEvents: 'none' }} />
                            :
                            <TbCopy className="CRMItemCopyIcon" style={{ pointerEvents: 'none' }} />
                        }
                    </div>
                    <div className="CRMItemCardDate">Обновлено: {formatDate(item.updatedAt)}</div>
                    <div className="CRMItemCardDate">Создано: {formatDate(item.createdAt)}</div>
                    <div className="CRMItemCardRow">
                        <div className="CRMItemCardLeftCol">
                            <div className="CRMItemCardSub">Изображения:</div>
                            <div className="CRMItemCardImages">
                                {foundItem && foundItem.img && foundItem.img.map((img, i) => {
                                    return (
                                        <div key={i} className="CRMItemCardImg">
                                            <input
                                                className="CRMImgDeleteCheckbox"
                                                type="checkbox"
                                                checked={checkedImages.includes(img.id)}
                                                onChange={() => handleCheckImage(img.id)}
                                            />
                                            <img src={img.img} alt="item" onClick={() => handleCheckImage(img.id)} />
                                        </div>
                                    )
                                })}
                            </div>
                            <div className={`CRMImgDeleteBtn ${checkedImages.length > 0 ? 'Active' : ''}`} onClick={() => setIsModal(true)}>
                                <BsTrash3 size={18} />
                            </div>
                            {isModal &&
                                <div className="CRMDeleteModalBox">
                                    <div className="CRMDeleteModal">
                                        <div className="CRMDeleteModalTitle">Удалить выбранные изображения?</div>
                                        <div className="CRMDeleteModalBtns">
                                            <div
                                                className="CRMDeleteModalBtn DeleteModalBtnCancel"
                                                onClick={() => {
                                                    setCheckedImages([])
                                                    setIsModal(false)
                                                }}
                                            >
                                                Отмена
                                            </div>
                                            <div className="CRMDeleteModalBtn DeleteModalBtnDelete" onClick={deleteImages}>Удалить</div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                        <div className="CRMItemCardRightCol">
                            {foundItem && foundItem.sizes && foundItem.sizes.length === 0 &&
                                <div className="CRMItemCardSub">Нет доступных размеров</div>
                            }
                            {foundItem && foundItem.sizes && foundItem.sizes.length > 0 &&
                                <>
                                    <div className="CRMItemCardSub">Таблица размеров и цен:</div>
                                    <table className="CRMItemCardSizesTable">
                                        <thead>
                                            <tr>
                                                {foundItem.category === 'shoes' &&
                                                    <>
                                                        <td>EU</td>
                                                        <td>FR</td>
                                                        <td>US</td>
                                                        <td>UK</td>
                                                        <td>СМ</td>
                                                    </>
                                                }
                                                {foundItem.category === 'clothes' &&
                                                    <>
                                                        <td>Размер</td>
                                                        {findSizeType('height') &&
                                                            <td>Рост</td>
                                                        }
                                                        {findSizeType('shoulder') && foundItem.brand !== 'Шорты' && foundItem.brand !== 'Штаны' &&
                                                            <td>Ширина плеч</td>
                                                        }
                                                        {findSizeType('chest_suit') && foundItem.brand !== 'Шорты' && foundItem.brand !== 'Штаны' &&
                                                            <td>Подходит для груди</td>
                                                        }
                                                        {findSizeType('chest_vol') && foundItem.brand !== 'Шорты' && foundItem.brand !== 'Штаны' &&
                                                            <td>Объём в груди</td>
                                                        }
                                                        {findSizeType('waist_suit') &&
                                                            <td>Подходит для талии</td>
                                                        }
                                                        {findSizeType('waist_vol') &&
                                                            <td>Объём в талии</td>
                                                        }
                                                        {findSizeType('hip_suit') &&
                                                            <td>Подходит для бёдер</td>
                                                        }
                                                        {findSizeType('hip_vol') &&
                                                            <td>Объём в бёдрах</td>
                                                        }
                                                        {findSizeType('length') &&
                                                            <td>
                                                                Длина
                                                                {foundItem.category === 'clothes' &&
                                                                    (foundItem.brand === 'Шорты' ? ' шорт' :
                                                                        foundItem.brand === 'Штаны' ? ' штанов' :
                                                                            foundItem.brand === 'Футболки' ? ' футболки' :
                                                                                foundItem.brand === 'Толстовки' ? ' толстовки' :
                                                                                    foundItem.brand === 'Куртки' && ' куртки'
                                                                    )}
                                                            </td>
                                                        }
                                                    </>
                                                }
                                                <td className="TdBlue">CNY</td>
                                                <td className="TdOrange">RUB*</td>
                                                <td>Заказы</td>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {foundItem && foundItem.sizes && foundItem.sizes.length > 0 && sortItemsBySize(foundItem.sizes).map((size, i) => {
                                                if (size.size_type === 'EU')
                                                    return (
                                                        <tr key={i}>
                                                            <td>{replaceSize(size.size)}</td>
                                                            {foundItem.category === 'shoes' &&
                                                                <>
                                                                    <td>{foundItem.sizes.find(item => item.size_default === size.size && item.size_type === 'FR') ? replaceSize(foundItem.sizes.find(item => item.size_default === size.size && item.size_type === 'FR').size) : '/'}</td>
                                                                    <td>{foundItem.sizes.find(item => item.size_default === size.size && item.size_type === 'US') ? replaceSize(foundItem.sizes.find(item => item.size_default === size.size && item.size_type === 'US').size) : '/'}</td>
                                                                    <td>{foundItem.sizes.find(item => item.size_default === size.size && item.size_type === 'UK') ? replaceSize(foundItem.sizes.find(item => item.size_default === size.size && item.size_type === 'UK').size) : '/'}</td>
                                                                    <td>
                                                                        {foundItem.sizes.find(item => item.size_default === size.size && item.size_type === 'JP') ?
                                                                            ((foundItem.sizes.find(item => item.size_default === size.size && item.size_type === 'JP').size > 80) ?
                                                                                (foundItem.sizes.find(item => item.size_default === size.size && item.size_type === 'JP').size / 10) :
                                                                                foundItem.sizes.find(item => item.size_default === size.size && item.size_type === 'JP').size) :
                                                                            '/'}
                                                                    </td>
                                                                </>
                                                            }
                                                            {foundItem.category === 'clothes' &&
                                                                <>
                                                                    {findSizeType('height') && getPrioritySizeCell('height', size.size, foundItem.sizes)}
                                                                    {findSizeType('shoulder') && foundItem.brand !== 'Шорты' && foundItem.brand !== 'Штаны' && getPrioritySizeCell('shoulder', size.size, foundItem.sizes)}
                                                                    {findSizeType('chest_suit') && foundItem.brand !== 'Шорты' && foundItem.brand !== 'Штаны' && getPrioritySizeCell('chest_suit', size.size, foundItem.sizes)}
                                                                    {findSizeType('chest_vol') && foundItem.brand !== 'Шорты' && foundItem.brand !== 'Штаны' && getPrioritySizeCell('chest_vol', size.size, foundItem.sizes)}
                                                                    {findSizeType('waist_suit') && getPrioritySizeCell('waist_suit', size.size, foundItem.sizes)}
                                                                    {findSizeType('waist_vol') && getPrioritySizeCell('waist_vol', size.size, foundItem.sizes)}
                                                                    {findSizeType('hip_suit') && getPrioritySizeCell('hip_suit', size.size, foundItem.sizes)}
                                                                    {findSizeType('hip_vol') && getPrioritySizeCell('hip_vol', size.size, foundItem.sizes)}
                                                                    {findSizeType('length') && getPrioritySizeCell('length', size.size, foundItem.sizes)}
                                                                </>
                                                            }
                                                            <td className="TdBlue">{FormatPrice.formatPrice(size.price / 100)} ¥</td>
                                                            <td className="TdOrange">{FormatPrice.formatPrice(size.price / 100 * constants.course)} ₽</td>
                                                            <td>{size.orders}</td>
                                                        </tr>
                                                    )
                                                else return null
                                            })}
                                        </tbody>
                                    </table>
                                    <div className="CRMItemCardFootnote">* Цены указаны без учета доставки и комиссии</div>
                                </>
                            }
                        </div>
                    </div>
                </>
            }
        </div>
    )
})