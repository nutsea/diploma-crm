import React, { useEffect, useState } from "react";
import './Item.scss';
import { observer } from "mobx-react-lite";
import { TbCopy, TbCopyCheckFilled } from "react-icons/tb";
import FormatPrice from "../../../../utils/FormatPrice";

const genders = {
    1: 'Унисекс',
    2: 'Мужской',
    3: 'Женский',
    4: 'Ребенок',
    5: 'Малыш',
    6: 'Средний ребенок',
    7: 'Старший ребенок'
}

export const Item = observer(({ item }) => {
    const [copied, setCopied] = useState(false)

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

    function replaceSize(size) {
        return size.replace(' 1/2', '½').replace(' 2/3', '⅔').replace(' 1/3', '⅓').replace(' 1/4', '¼').replace(' 3/4', '¾')
    }

    useEffect(() => {

    }, [])

    return (
        <>
            <td>
                <div className="CRMItemUidBox">
                    <div className="CRMItemUid noThumb" onClick={handleCopy}>
                        {item.item_uid}
                        {copied ?
                            <TbCopyCheckFilled className="CRMItemCopyIcon" style={{ pointerEvents: 'none' }} />
                            :
                            <TbCopy className="CRMItemCopyIcon" style={{ pointerEvents: 'none' }} />
                        }
                    </div>
                </div>
            </td>
            <td>
                <div className="CRMItemImgBox">
                    <img className="CRMItemImg" src={item.img && item.img[0].img ? item.img[0].img : item.img} alt="Фото товара" />
                </div>
            </td>
            <td className="CRMItemName">{item.name}</td>
            <td className="CRMItemPrice Blue">
                <span>
                    {!item.min_size && !item.max_size ? '‒' :
                        <>
                            {item.min_price !== 100000000 ? FormatPrice.formatPrice(item.min_price / 100) + ' ¥' : ''} {item.min_price !== item.max_price && '‒'} {item.min_price !== item.max_price && item.max_price !== 0 ? FormatPrice.formatPrice(item.max_price / 100) + ' ¥' : ''}
                        </>
                    }
                </span>
            </td>
            <td className="CRMItemOrders">
                {!item.min_size && !item.max_size && '‒'}
                {item.min_size && replaceSize(item.min_size)} {item.max_size !== item.min_size ? '‒' : ''} {item.max_size && item.max_size !== item.min_size && replaceSize(item.max_size)}
            </td>
            <td className="CRMItemName">{item.fitId ? (genders[item.fitId] ? genders[item.fitId] : 'не определён') : '‒'}</td>
            <td className="CRMItemDate">{formatDate(item.updatedAt)}</td>
        </>
    )
})