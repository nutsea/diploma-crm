import React, { Fragment, useContext, useEffect, useState } from "react";
import './Items.scss';
import { checkOrderCost, deleteItems, fetchAdminItems, fetchBrandsAndModels, fetchOneItemBySpu, updateBrandAndModel } from "../../../http/itemAPI";
import { Context } from "../../..";
import { observer } from "mobx-react-lite";
import { Item } from "./item/Item";
import { Pagination } from "../../pagination/Pagination";
import FormatPrice from "../../../utils/FormatPrice";
import { ItemCard } from "../itemCard/ItemCard";
import { RxUpdate } from "react-icons/rx";
import { BsTrash3 } from "react-icons/bs";

import loop1 from '../../../assets/loop1.svg'

import { v4 } from 'uuid'
import { useRef } from "react";

export const Items = observer(() => {
    const { items, constants } = useContext(Context)
    const [loading, setLoading] = useState(false)
    const [totalPages, setTotalPages] = useState(1)
    const [checked, setChecked] = useState([])
    const [search, setSearch] = useState('')
    const [isFocus, setIsFocus] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [chosenItem, setChosenItem] = useState(null)
    const [isDeleteModal, setIsDeleteModal] = useState(false)
    const [isUpdateModal, setIsUpdateModal] = useState(false)
    const [isUpdateModal2, setIsUpdateModal2] = useState(false)
    const [brand, setBrand] = useState('')
    const [model, setModel] = useState('')
    const [autocomplete, setAutocomplete] = useState([])
    const [autocomplete2, setAutocomplete2] = useState([])
    const [brands, setBrands] = useState([])
    const [models, setModels] = useState([])
    const [timeElapsed, setTimeElapsed] = useState('')
    const [lastLink, setLastLink] = useState(null)
    const fetchId = useRef(null)

    const getItems = async () => {
        setLoading(true)
        handleTop()
        const uid = v4()
        fetchId.current = uid
        await fetchAdminItems(items.crmLimit, items.page, search)
            .then(async data => {
                if (uid === fetchId.current) {
                    items.setItems(data)
                    setTotalPages(Math.ceil(data.count / items.crmLimit))
                    if (localStorage.getItem('lastSpu')) {
                        await fetchOneItemBySpu(localStorage.getItem('lastSpu')).then(data2 => {
                            setLastLink(data2)
                            setLoading(false)
                        })
                    } else {
                        setLoading(false)
                    }
                }
            })
    }

    const handleSelectPage = (page) => {
        items.setPage(page)
    }

    const handleTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    const checkAll = () => {
        if (items.items.map(item => item.item_uid).every(id => checked.includes(id))) {
            setChecked(checked.filter(id => !items.items.map(item => item.item_uid).includes(id)))
            const checkboxes = document.querySelectorAll('#itemCheck')
            checkboxes.forEach(checkbox => {
                checkbox.checked = false
            })
        } else {
            setChecked(items.items.map(item => item.item_uid))
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
        const tooltipElement = document.querySelector('.Thumbnail')
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

    const formatDate = (date) => {
        const newDate = new Date(date);
        const day = newDate.getDate().toString().padStart(2, '0');
        const month = (newDate.getMonth() + 1).toString().padStart(2, '0');
        const year = newDate.getFullYear().toString();
        return `${day}.${month}.${year}`;
    }

    const handleChooseItem = (e, item) => {
        if (e.target.closest('.noThumb')) return
        setChosenItem(item)
        window.scrollTo({
            top: 150,
            behavior: 'smooth'
        })
    }

    const handleBackItem = () => {
        setChosenItem(null)
        setIsHovered('')
    }

    const handleUpdateItems = async () => {
        setIsUpdateModal(false)
        setLoading(true)
        await checkOrderCost(checked, timeElapsed).then(() => {
            setTimeElapsed('')
            getItems()
            setChecked([])
        })
    }

    const handleUpdateItems2 = async () => {
        setIsUpdateModal2(false)
        setLoading(true)
        await updateBrandAndModel(checked, brand, model).then(() => {
            setBrand('')
            setModel('')
            getItems()
            setChecked([])
        })
    }

    const handleDeleteItems = async () => {
        setIsDeleteModal(false)
        setLoading(true)
        await deleteItems(checked).then(() => {
            getItems()
            setChecked([])
        })
    }


    const handleBrand = (e) => {
        const value = e.target.value
        const valueArr = value.split(' ')
        if (value.length === 0) {
            setAutocomplete([])
        } else {
            setAutocomplete(brands.filter(brand => {
                let allCompare = true
                for (let i of valueArr) {
                    if (!brand.brand.toLowerCase().includes(i.toLowerCase())) allCompare = false
                }
                return allCompare
            }))
        }
        setBrand(value)
    }

    const handleModel = (e) => {
        const value = e.target.value
        const valueArr = value.split(' ')
        if (value.length === 0) {
            setAutocomplete2([])
        } else {
            setAutocomplete2(models.filter(model => {
                let allCompare = true
                for (let i of valueArr) {
                    if (!model.model.toLowerCase().includes(i.toLowerCase())) allCompare = false
                    if (brand && model.brand !== brand) allCompare = false
                }
                return allCompare
            }))
        }
        setModel(value)
    }

    const findBrands = async () => {
        await fetchBrandsAndModels().then(data => {
            setBrands(data)
            for (let i of data) {
                for (let j of i.models) {
                    setModels(prev => [...prev, j])
                }
            }
        })
    }

    const handleTimeElapsed = (e) => {
        const value = e.target.value.replace(/\D/g, '')
        setTimeElapsed(value)
    }

    useEffect(() => {
        getItems()
        setChecked([])
        // eslint-disable-next-line
    }, [items.page, search])

    useEffect(() => {
        findBrands()
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.BrandInputBoxItems')) {
                setAutocomplete([])
            } else {
                const value = document.querySelector('.BrandInput').value
                if (value.length > 0) {
                    const valueArr = value.split(' ')
                    setAutocomplete(brands.filter(brand => {
                        let allCompare = true
                        for (let i of valueArr) {
                            if (!brand.brand.toLowerCase().includes(i.toLowerCase())) allCompare = false
                        }
                        return allCompare
                    }))
                }
            }

            if (!e.target.closest('.ModelInputBoxItems')) {
                setAutocomplete2([])
            } else {
                const value = document.querySelector('.ModelInput').value
                if (value.length > 0) {
                    const valueArr = value.split(' ')
                    setAutocomplete2(models.filter(model => {
                        let allCompare = true
                        for (let i of valueArr) {
                            if (!model.model.toLowerCase().includes(i.toLowerCase())) allCompare = false
                            if (brand && model.brand !== brand) allCompare = false
                        }
                        return allCompare
                    }))
                }
            }
        })
        // eslint-disable-next-line
    }, [])

    return (
        <div className="CRMItems">
            {chosenItem ?
                <ItemCard item={chosenItem} onBack={handleBackItem} />
                :
                <>
                    <div className={`CRMSearchItems ${isFocus ? 'Focused' : ''}`}>
                        <img src={loop1} alt="Поиск" />
                        <input
                            type="text"
                            placeholder='Поиск по товарам'
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    {loading ?
                        <div className="LoaderBox2">
                            <div className="Loader"></div>
                        </div>
                        :
                        <>
                            {items.items && items.items.length > 0 &&
                                <>
                                    <div className="CRMItemsChecked">Выбрано: {checked.length}</div>
                                    <div className="CRMItemsBtns">
                                        <div className={`CRMItemsUpdateBtn ${checked.length > 0 ? '' : 'Inactive'}`} onClick={() => setIsUpdateModal(true)}>
                                            <RxUpdate size={16} />
                                            <span>Обновить выбранное</span>
                                        </div>
                                        <div className={`CRMItemsUpdateBtn2 ${checked.length > 0 ? '' : 'Inactive'}`} onClick={() => setIsUpdateModal2(true)}>
                                            <RxUpdate size={16} />
                                            <span>Изменить бренд/модель</span>
                                        </div>
                                        <div className={`CRMItemsDeleteBtn ${checked.length > 0 ? '' : 'Inactive'}`} onClick={() => setIsDeleteModal(true)}>
                                            <BsTrash3 size={16} />
                                            <span>Удалить выбранное</span>
                                        </div>
                                    </div>
                                    {isDeleteModal &&
                                        <div className="CRMDeleteModalBox">
                                            <div className="CRMDeleteModal">
                                                <div className="CRMDeleteModalTitle">Удалить выбранные товары ({checked.length})?</div>
                                                <div className="CRMDeleteModalBtns">
                                                    <div
                                                        className="CRMDeleteModalBtn DeleteModalBtnCancel"
                                                        onClick={() => {
                                                            setIsDeleteModal(false)
                                                        }}
                                                    >
                                                        Отмена
                                                    </div>
                                                    <div className="CRMDeleteModalBtn DeleteModalBtnDelete" onClick={handleDeleteItems}>Удалить</div>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    {isUpdateModal &&
                                        <div className="CRMDeleteModalBox">
                                            <div className="CRMDeleteModal">
                                                <div className="CRMDeleteModalTitle">Обновить выбранные товары ({checked.length})?</div>
                                                <input className="CRMItemsInput TimeElapsedInput" maxLength={255} value={timeElapsed} onChange={handleTimeElapsed} placeholder="timeElapsed (необязательно)" />
                                                <div className="CRMDeleteModalBtns">
                                                    <div
                                                        className="CRMDeleteModalBtn DeleteModalBtnCancel"
                                                        onClick={() => {
                                                            setIsUpdateModal(false)
                                                        }}
                                                    >
                                                        Отмена
                                                    </div>
                                                    <div className="CRMDeleteModalBtn DeleteModalBtnUpdate" onClick={handleUpdateItems}>Обновить</div>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    {isUpdateModal2 &&
                                        <div className="CRMDeleteModalBox">
                                            <div className="CRMDeleteModal">
                                                <div className="CRMDeleteModalTitle">Изменить выбранные товары ({checked.length})?</div>
                                                <div className="BrandInputBoxItems">
                                                    <input className="CRMItemsInput BrandInput" maxLength={255} value={brand} onChange={handleBrand} placeholder="Бренд" />
                                                    {autocomplete.length > 0 &&
                                                        <div className="AutocompleteBrand">
                                                            {autocomplete.map((item, index) => {
                                                                return (
                                                                    <div
                                                                        key={index}
                                                                        className="AutocompleteItemBrand"
                                                                        onClick={() => {
                                                                            setBrand(item.brand.trim())
                                                                            setModel('')
                                                                            setAutocomplete([])
                                                                        }}
                                                                    >
                                                                        {item.brand}
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    }
                                                </div>
                                                <div className="ModelInputBoxItems">
                                                    <input className="CRMItemsInput ModelInput" maxLength={255} value={model} onChange={handleModel} placeholder="Модель" />
                                                    {autocomplete2.length > 0 &&
                                                        <div className="AutocompleteBrand">
                                                            {autocomplete2.map((item, index) => {
                                                                return (
                                                                    <div
                                                                        key={index}
                                                                        className="AutocompleteItemBrand"
                                                                        onClick={() => {
                                                                            setModel(item.model.trim())
                                                                            setBrand(item.brand.trim())
                                                                            setAutocomplete2([])
                                                                        }}
                                                                    >
                                                                        {item.model}
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    }
                                                </div>
                                                <div className="CRMDeleteModalBtns">
                                                    <div
                                                        className="CRMDeleteModalBtn DeleteModalBtnCancel"
                                                        onClick={() => {
                                                            setIsUpdateModal2(false)
                                                        }}
                                                    >
                                                        Отмена
                                                    </div>
                                                    <div className={`CRMDeleteModalBtn DeleteModalBtnUpdate ${brand.length > 0 && model.length > 0 ? '' : 'Inactive'}`} onClick={handleUpdateItems2}>Изменить</div>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    <div className="CRMItemsTableBox">
                                        <table className="CRMItemsTable">
                                            <thead>
                                                <tr>
                                                    <th>
                                                        <input
                                                            className="CRMItemCheck"
                                                            type="checkbox"
                                                            id="itemCheck"
                                                            onChange={checkAll}
                                                            checked={items.items.map(item => item.item_uid).every(id => checked.includes(id))}
                                                        />
                                                    </th>
                                                    <th>id</th>
                                                    <th>Фото</th>
                                                    <th>Название</th>
                                                    <th>CNY</th>
                                                    <th>Размер</th>
                                                    <th>Пол</th>
                                                    <th>Обновлено</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {lastLink && lastLink.id &&
                                                    <Fragment>
                                                        <tr
                                                            className="CRMItemTr ParsedExist"
                                                            onMouseEnter={(e) => handleMouseEnter(e, lastLink.id)}
                                                            onMouseMove={(e) => handleMouseMove(e, lastLink.id)}
                                                            onMouseLeave={handleMouseLeave}
                                                            onClick={(e) => handleChooseItem(e, lastLink)}
                                                        >
                                                            <td className="noThumb">
                                                                <input
                                                                    className="CRMItemCheck noThumb"
                                                                    type="checkbox"
                                                                    id="itemCheck"
                                                                    onChange={() => handleCheck(lastLink.item_uid)}
                                                                    checked={checked.includes(lastLink.item_uid)}
                                                                />
                                                            </td>
                                                            <Item item={lastLink} />
                                                            <td style={{ width: 0, padding: 0 }}>
                                                                <div
                                                                    className={`Thumbnail ${isHovered === lastLink.id ? 'Active' : ''}`}
                                                                    style={{ left: position.x + 10, top: position.y + 10 }}
                                                                >
                                                                    <img src={lastLink.img} alt="" />
                                                                    <div className="ThumbName">{lastLink.name}</div>
                                                                    <div className="ThumbUid">{lastLink.item_uid}</div>
                                                                    {lastLink.min_price !== 100000000 && lastLink.max_price !== 0 &&
                                                                        <>
                                                                            <div className="ThumbPrice Blue">
                                                                                {lastLink.min_price !== 100000000 ? FormatPrice.formatPrice(lastLink.min_price / 100) + ' ¥' : ''} - {lastLink.max_price !== 0 ? FormatPrice.formatPrice(lastLink.max_price / 100) + ' ¥' : ''}
                                                                            </div>
                                                                            <div className="ThumbPrice Orange">
                                                                                {lastLink.min_price !== 100000000 ? FormatPrice.formatPrice(lastLink.min_price / 100 * constants.course) + ' ₽' : ''} - {lastLink.max_price !== 0 ? FormatPrice.formatPrice(lastLink.max_price / 100 * constants.course) + ' ₽' : ''}
                                                                            </div>
                                                                        </>
                                                                    }
                                                                    <div className="ThumbFav">В избранном: {lastLink.fav}</div>
                                                                    <div className="ThumbFav">В корзине: {lastLink.cart}</div>
                                                                    <div className="ThumbFav Blue">Заказов: {lastLink.orders}</div>
                                                                    <div className="ThumbDate">Обновлено: {formatDate(lastLink.updatedAt)}</div>
                                                                    <div className="ThumbDate">Создано: {formatDate(lastLink.createdAt)}</div>
                                                                    {lastLink.min_price !== 100000000 && lastLink.max_price !== 0 &&
                                                                        <>
                                                                            <div className="ThumbLine"></div>
                                                                            <div className="ThumbFootnote">* Цены указаны без учета доставки и комиссии</div>
                                                                        </>
                                                                    }
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </Fragment>
                                                }
                                                {items.items.map((item, i) => {
                                                    if (!lastLink || lastLink.id !== item.id) {
                                                        return (
                                                            <Fragment key={i}>
                                                                <tr
                                                                    className="CRMItemTr"
                                                                    onMouseEnter={(e) => handleMouseEnter(e, item.id)}
                                                                    onMouseMove={(e) => handleMouseMove(e, item.id)}
                                                                    onMouseLeave={handleMouseLeave}
                                                                    onClick={(e) => handleChooseItem(e, item)}
                                                                >
                                                                    <td className="noThumb">
                                                                        <input
                                                                            className="CRMItemCheck noThumb"
                                                                            type="checkbox"
                                                                            id="itemCheck"
                                                                            onChange={() => handleCheck(item.item_uid)}
                                                                            checked={checked.includes(item.item_uid)}
                                                                        />
                                                                    </td>
                                                                    <Item item={item} />
                                                                    <td style={{ width: 0, padding: 0 }}>
                                                                        <div
                                                                            className={`Thumbnail ${isHovered === item.id ? 'Active' : ''}`}
                                                                            style={{ left: position.x + 10, top: position.y + 10 }}
                                                                        >
                                                                            <img src={item.img} alt="" />
                                                                            <div className="ThumbName">{item.name}</div>
                                                                            <div className="ThumbUid">{item.item_uid}</div>
                                                                            {item.min_price !== 100000000 && item.max_price !== 0 &&
                                                                                <>
                                                                                    <div className="ThumbPrice Blue">
                                                                                        {item.min_price !== 100000000 ? FormatPrice.formatPrice(item.min_price / 100) + ' ¥' : ''} - {item.max_price !== 0 ? FormatPrice.formatPrice(item.max_price / 100) + ' ¥' : ''}
                                                                                    </div>
                                                                                    <div className="ThumbPrice Orange">
                                                                                        {item.min_price !== 100000000 ? FormatPrice.formatPrice(item.min_price / 100 * constants.course) + ' ₽' : ''} - {item.max_price !== 0 ? FormatPrice.formatPrice(item.max_price / 100 * constants.course) + ' ₽' : ''}
                                                                                    </div>
                                                                                </>
                                                                            }
                                                                            <div className="ThumbFav">В избранном: {item.fav}</div>
                                                                            <div className="ThumbFav">В корзине: {item.cart}</div>
                                                                            <div className="ThumbFav Blue">Заказов: {item.orders}</div>
                                                                            <div className="ThumbDate">Обновлено: {formatDate(item.updatedAt)}</div>
                                                                            <div className="ThumbDate">Создано: {formatDate(item.createdAt)}</div>
                                                                            {item.min_price !== 100000000 && item.max_price !== 0 &&
                                                                                <>
                                                                                    <div className="ThumbLine"></div>
                                                                                    <div className="ThumbFootnote">* Цены указаны без учета доставки и комиссии</div>
                                                                                </>
                                                                            }
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </Fragment>
                                                        )
                                                    } else return null
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            }
                        </>
                    }
                </>
            }
            {items.items && items.items.length > 0 &&
                <div className={`CRMPag ${chosenItem ? 'InvisiblePagination' : ''}`}>
                    <Pagination totalPages={totalPages} onSelectPage={handleSelectPage} />
                </div>
            }
        </div>
    )
})
