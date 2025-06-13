import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { TbCopy, TbCopyCheckFilled } from "react-icons/tb";

export const Item = observer(({ item }) => {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        await navigator.clipboard.writeText(item.spuId)
        setCopied(true)
        setTimeout(() => {
            setCopied(false)
        }, 1000)
    }

    function filterString(str) {
        // const regex = /[^a-zA-Zа-яА-Я0-9 \-]/g
        const regex = /[^a-zA-Zа-яА-Я0-9 -]/g
        let newStr = str.replace(regex, '')
        if (str.includes('【定制球鞋】')) {
            newStr = '[Custom] ' + newStr
        }
        return newStr
    }

    const filterDeletionType = (str) => {
        switch (str) {
            case 'no_sizes':
                return 'Нет размеров'
            case 'invalid_sizes':
                return 'Некорректные размеры'

            default:
                return str
        }
    }

    return (
        <>
            <td>
                <div>
                    <div className="CRMParseUid" onClick={handleCopy}>
                        {item.spuId && item.spuId}
                        {item.item_uid && item.item_uid}
                        {copied ?
                            <TbCopyCheckFilled className="CRMParseCopyIcon" style={{ pointerEvents: 'none' }} />
                            :
                            <TbCopy className="CRMParseCopyIcon" style={{ pointerEvents: 'none' }} />
                        }
                    </div>
                </div>
            </td>
            <td>
                <div className="CRMParseImgBox">
                    {item.logoUrl &&
                        <img className="CRMItemImg" src={item.logoUrl} alt="Фото товара" />
                    }
                    {item.img &&
                        <img className="CRMItemImg" src={item.img} alt="Фото товара" />
                    }
                </div>
            </td>
            {item.title &&
                <td className="CRMParseName">{filterString(item.title)}</td>
            }
            {item.name &&
                <td className="CRMParseName">{filterString(item.name)}</td>
            }
            {item.deletion_type &&
                <td className="CRMParseName">{filterDeletionType(item.deletion_type)}</td>
                // <td className="CRMParseName">{item.deletion_type}</td>
            }
        </>
    )
})