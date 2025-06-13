import React, { Fragment, useContext, useEffect, useRef, useState } from "react";
import './PoizonParse.scss';
import { Item } from "./item/Item";
import { fetchAdminDeletedItems, fetchAutoConstants, fetchAutoDeclension, fetchBrandsAndModels, getLinkItem, getSpuIds, getSpuItems } from "../../../http/itemAPI";

import { RxDownload } from "react-icons/rx";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { Context } from "../../..";
import { observer } from "mobx-react-lite";
import { Pagination } from "../../pagination/Pagination";
import { v4 } from 'uuid'

// eslint-disable-next-line
const parsedTest = {
    "total": 2773,
    "page": 2,
    "lastId": "10",
    "productList": [
        {
            "spuId": 7609771,
            "logoUrl": "https://cdn.poizon.com/pro-img/origin-img/20240321/14c77ef0f97c420881c33c6450d8f86d.jpg",
            "images": [
                "https://cdn.poizon.com/pro-img/origin-img/20240321/14c77ef0f97c420881c33c6450d8f86d.jpg"
            ],
            "title": "adidas originals FORUM 皮革绒面革 圆头系带 减震耐磨 低帮 板鞋 女款 白灰蓝",
            "articleNumber": "IG3964"
        },
        {
            "spuId": 1370855,
            "logoUrl": "https://cdn.poizon.com/pro-img/origin-img/20220212/a6d20381bdc247d7b6c6d7b751293d92.jpg",
            "images": [
                "https://cdn.poizon.com/pro-img/origin-img/20220212/a6d20381bdc247d7b6c6d7b751293d92.jpg"
            ],
            "title": "adidas originals FORUM 84 Low Adv 防滑耐磨 低帮 板鞋 男款 米白",
            "articleNumber": "FY7998"
        },
        {
            "spuId": 3847744,
            "logoUrl": "https://cdn.poizon.com/pro-img/origin-img/20221220/7805d46f3f314319886fd883137dec49.jpg",
            "images": [
                "https://cdn.poizon.com/pro-img/origin-img/20221220/7805d46f3f314319886fd883137dec49.jpg"
            ],
            "title": "Nike Dunk Low \"Noble Green\" 防滑耐磨 低帮 板鞋 女款 绿色",
            "articleNumber": "FD0350-133"
        },
        {
            "spuId": 7588193,
            "logoUrl": "https://cdn.poizon.com/pro-img/origin-img/20240415/34fa172a78c641ed9c3fcd07e4363e0b.jpg",
            "images": [
                "https://cdn.poizon.com/pro-img/origin-img/20240415/34fa172a78c641ed9c3fcd07e4363e0b.jpg"
            ],
            "title": "adidas originals FORUM 百搭休闲 轻松舒适 减震耐磨 低帮 板鞋 男女同款 白色",
            "articleNumber": "IG3769"
        },
        {
            "spuId": 11543209,
            "logoUrl": "https://cdn.poizon.com/pro-img/origin-img/20240618/de3a4b86349947ce9d6a0b42ffce21e9.jpg",
            "images": [
                "https://cdn.poizon.com/pro-img/origin-img/20240618/de3a4b86349947ce9d6a0b42ffce21e9.jpg"
            ],
            "title": "adidas originals FORUM Low Cl 舒适 防滑耐磨 低帮 板鞋 男女同款 白色",
            "articleNumber": "IH7828"
        }
    ]
}

const categories = {
    shoes: 'Обувь',
    clothes: 'Одежда',
    accessories: 'Аксессуары',
    cosmetics: 'Косметика',
    perfumery: 'Парфюмерия'
}

export const PoizonParse = observer(({ onDownload }) => {
    const { deleted_items } = useContext(Context)
    const [keyword, setKeyword] = useState('')
    const [limit, setLimit] = useState('')
    const [page, setPage] = useState('') // -1
    const [parsed, setParsed] = useState([])
    const [checked, setChecked] = useState([])
    const [loading, setLoading] = useState(false)
    const [wasParsed, setWasParsed] = useState(false)
    const [category, setCategory] = useState('shoes')
    const [listOpen, setListOpen] = useState(false)
    const [placeholder1, setPlaceholder1] = useState('Бренд')
    const [placeholder2, setPlaceholder2] = useState('Модель')
    const [placeholder3, setPlaceholder3] = useState('')
    const [isDownloading, setIsDownloading] = useState(false)
    const [timeElapsed, setTimeElapsed] = useState('')
    const [timeElapsed2, setTimeElapsed2] = useState('')
    const [brand, setBrand] = useState('')
    const [model, setModel] = useState('')
    const [declension, setDeclension] = useState('')
    const [fastShip, setFastShip] = useState('')
    const [slowShip, setSlowShip] = useState('')
    const [autocomplete, setAutocomplete] = useState([])
    const [autocomplete2, setAutocomplete2] = useState([])
    const [brands, setBrands] = useState([])
    const [models, setModels] = useState([])
    const [link, setLink] = useState('')
    const [parseTab, setParseTab] = useState('search')
    const [error, setError] = useState(false)
    const [error2, setError2] = useState(false)
    const [totalPages, setTotalPages] = useState(1)
    const [declensionLoader, setDeclensionLoader] = useState(false)
    const [expressLoader, setExpressLoader] = useState(false)
    const [standartLoader, setStandartLoader] = useState(false)
    const fetchId = useRef(null)
    const fetchId2 = useRef(null)

    const handleKeyword = (e) => {
        setKeyword(e.target.value)
    }

    const handleLink = (e) => {
        setLink(e.target.value)
    }

    const handleLimit = (e) => {
        const value = e.target.value.replace(/\D/g, '')
        setLimit(value)
    }

    const handlePage = (e) => {
        const value = e.target.value.replace(/\D/g, '')
        setPage(value)
    }

    const handleTimeElapsed = (e) => {
        const value = e.target.value.replace(/\D/g, '')
        setTimeElapsed(value)
    }

    const handleTimeElapsed2 = (e) => {
        const value = e.target.value.replace(/\D/g, '')
        setTimeElapsed2(value)
    }

    const handleShip = (e, type) => {
        const value = e.target.value.replace(/\D/g, '')
        if (type === 'express') setFastShip(value)
        if (type === 'standart') setSlowShip(value)
    }

    const checkAll = () => {
        if (parsed.productList.map(item => item.spuId).every(id => checked.includes(id))) {
            setChecked(checked.filter(id => !parsed.productList.map(item => item.spuId).includes(id)))
            const checkboxes = document.querySelectorAll('#itemCheck')
            checkboxes.forEach(checkbox => {
                checkbox.checked = false
            })
        } else {
            setChecked(parsed.productList.map(item => item.spuId))
            const checkboxes = document.querySelectorAll('#itemCheck')
            checkboxes.forEach(checkbox => {
                checkbox.checked = true
            })
        }
    }

    // eslint-disable-next-line
    const checkAllDeleted = () => {
        if (deleted_items.items.map(item => item.item_uid).every(id => checked.includes(id))) {
            setChecked(checked.filter(id => !deleted_items.items.map(item => item.item_uid).includes(id)))
            const checkboxes = document.querySelectorAll('#itemCheck')
            checkboxes.forEach(checkbox => {
                checkbox.checked = false
            })
        } else {
            setChecked(deleted_items.items.map(item => item.item_uid))
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

    const handleParse = async () => {
        try {
            setLoading(true)
            await getSpuIds(keyword, limit, page - 1, timeElapsed).then(data => {
                setParsed(data)
                setLoading(false)
                setWasParsed(true)
                setError(false)
            })
        } catch (e) {
            setLoading(false)
            setError(true)
        }
    }

    const handleDownload = async () => {
        setIsDownloading(true)
        await getSpuItems(checked, category, timeElapsed2, brand, model, declension, category === 'clothes' && fastShip, category === 'clothes' && slowShip).then(data => {
            onDownload()
        })
    }

    const handleDownload2 = async () => {
        setIsDownloading(true)
        setError2(false)
        await getLinkItem(link, category, timeElapsed2, brand, model, declension, category === 'clothes' && fastShip, category === 'clothes' && slowShip).then(data => {
            console.log(data)
            if (!data.status) {
                localStorage.setItem('lastSpu', data.spuId)
                onDownload()
            } else {
                setIsDownloading(false)
                setError2(true)
            }
        })
    }

    const findBrands = async () => {
        await fetchBrandsAndModels(category).then(data => {
            setBrands(data)

            const uniqueModels = new Map()

            for (let i of data) {
                for (let j of i.models) {
                    const key = `${j.brand}-${j.model}`
                    if (!uniqueModels.has(key)) {
                        uniqueModels.set(key, j)
                    }
                }
            }

            setModels(Array.from(uniqueModels.values()))
        })
    }

    const autoDeclension = async (value) => {
        if (category === 'clothes') {
            setDeclensionLoader(true)
            const uid = v4()
            fetchId.current = uid
            await fetchAutoDeclension(value).then(data => {
                if (data && uid === fetchId.current) {
                    setDeclension(data)
                }
                setDeclensionLoader(false)
            })
        }
    }

    const autoConstants = async (value) => {
        if (category === 'clothes') {
            setExpressLoader(true)
            setStandartLoader(true)
            const uid = v4()
            fetchId2.current = uid
            await fetchAutoConstants(value).then(data => {
                if (data && uid === fetchId2.current) {
                    const expressConstant = data.find(i => i.type === 'express')?.value
                    expressConstant && setFastShip(expressConstant)
                    const standartConstant = data.find(i => i.type === 'standart')?.value
                    standartConstant && setSlowShip(standartConstant)
                }
                setExpressLoader(false)
                setStandartLoader(false)
            })
        }
    }

    const handleBrand = async (e) => {
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
        autoDeclension(value)
        autoConstants(value)
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
                    if (allCompare) console.log(model)
                }
                return allCompare
            }))
        }
        setModel(value)
    }

    const getItems = async () => {
        setLoading(true)
        await fetchAdminDeletedItems(deleted_items.crmLimit, deleted_items.page)
            .then(async data => {
                deleted_items.setItems(data)
                setTotalPages(Math.ceil(data.count / deleted_items.crmLimit))
                setLoading(false)
            })
    }

    const handleSelectPage = (page) => {
        deleted_items.setPage(page)
    }

    useEffect(() => {
        getItems()
        findBrands()
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.ParseSelect')) {
                setListOpen(false)
            }
            if (!e.target.closest('.BrandInputBox')) {
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

            if (!e.target.closest('.ModelInputBox')) {
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

    useEffect(() => {
        getItems()
        setChecked([])
        // eslint-disable-next-line
    }, [parseTab])

    useEffect(() => {
        getItems()
        // eslint-disable-next-line
    }, [deleted_items.page])

    useEffect(() => {
        setAutocomplete([])
        findBrands()
        switch (category) {
            case 'shoes':
                setPlaceholder1('Бренд')
                setPlaceholder2('Модель')
                setPlaceholder3('')
                break

            case 'clothes':
                setPlaceholder1('Категория')
                setPlaceholder2('Бренд')
                setPlaceholder3('Категория в карточке товара')
                if (brand) {
                    autoDeclension(brand)
                    autoConstants(brand)
                }
                break

            default:
                break
        }
        // eslint-disable-next-line
    }, [category])

    return (
        <div className="CRMParse">
            <div className="CRMOrdersTabs">
                <div className={`CRMOrdersTab ${parseTab === 'search' ? 'Active' : ''}`} onClick={() => setParseTab('search')}>Поиск товаров</div>
                <div className="CRMOrdersTabLine"></div>
                <div className={`CRMOrdersTab ${parseTab === 'link' ? 'Active' : ''}`} onClick={() => setParseTab('link')}>Товары по ссылке</div>
                <div className="CRMOrdersTabLine"></div>
                <div className={`CRMOrdersTab ${parseTab === 'deleted' ? 'Active' : ''}`} onClick={() => setParseTab('deleted')}>Удалённые товары</div>
            </div>
            {parseTab === 'search' &&
                <div className="CRMParseRow">
                    <div className="CRMParseCol">
                        <div className="CRMParseSub">Поиск товаров</div>
                        <div className="SearchInputBox">
                            <label>Ваш запрос</label>
                            <input className="CRMParseInput SearchInput" maxLength={255} value={keyword} onChange={handleKeyword} />
                        </div>
                        <div className="SearchInputBox">
                            <label>Количество товаров</label>
                            <input className="CRMParseInput" value={limit} onChange={handleLimit} />
                        </div>
                        <div className="SearchInputBox">
                            <label>Номер страницы</label>
                            <input className="CRMParseInput" value={page} onChange={handlePage} />
                        </div>
                        <div className="SearchInputBox">
                            <label>timeElapsed (необязательно)</label>
                            <input className="CRMParseInput" value={timeElapsed} onChange={handleTimeElapsed} />
                        </div>
                        <div className={`CRMParseBtn ${keyword && Number(limit) && Number(page) ? 'Active' : ''}`} onClick={handleParse}>Поиск</div>
                    </div>
                    <div className="CRMParseCol">
                        <div className="CRMParseSub">Сортировка и загрузка товаров</div>
                        <div className="BrandInputBox">
                            <label>{placeholder1}</label>
                            <input className="CRMParseInput BrandInput" maxLength={255} value={brand} onChange={handleBrand} />
                            {declensionLoader && category === 'clothes' &&
                                <div className="InputLoader"></div>
                            }
                            {autocomplete.length > 0 &&
                                <div className="AutocompleteBrand Width378">
                                    {autocomplete.map((item, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className="AutocompleteItemBrand"
                                                onClick={() => {
                                                    setBrand(item.brand.trim())
                                                    autoDeclension(item.brand.trim())
                                                    autoConstants(item.brand.trim())
                                                    setModel('')
                                                    if (category === 'clothes') {
                                                        setFastShip(item.fast_ship)
                                                        setSlowShip(item.slow_ship)
                                                    }
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
                        {placeholder3 &&
                            <div className="ModelInputBox">
                                <label>{placeholder3}</label>
                                <input className="CRMParseInput ModelInput" maxLength={255} value={declension} onChange={(e) => setDeclension(e.target.value)} />
                            </div>
                        }
                        {placeholder3 &&
                            <div className="ModelInputBox">
                                <label>Стандарт доставка</label>
                                <input className="CRMParseInput ModelInput" maxLength={255} value={slowShip} onChange={(e) => handleShip(e, 'standart')} />
                                {standartLoader && category === 'clothes' &&
                                    <div className="InputLoader"></div>
                                }
                            </div>
                        }
                        {placeholder3 &&
                            <div className="ModelInputBox">
                                <label>Экспресс доставка</label>
                                <input className="CRMParseInput ModelInput" maxLength={255} value={fastShip} onChange={(e) => handleShip(e, 'express')} />
                                {expressLoader && category === 'clothes' &&
                                    <div className="InputLoader"></div>
                                }
                            </div>
                        }
                        <div className="ModelInputBox">
                            <label>{placeholder2}</label>
                            <input className="CRMParseInput ModelInput" maxLength={255} value={model} onChange={handleModel} />
                            {autocomplete2.length > 0 &&
                                <div className="AutocompleteBrand Width378">
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
                        <div className="ParseSelect Width350" onClick={() => setListOpen(!listOpen)}>
                            <span>{categories[category]}</span>
                            {listOpen ?
                                <IoIosArrowUp size={14} />
                                :
                                <IoIosArrowDown size={14} />
                            }
                            {listOpen &&
                                <div className="ParseSelectList Width378">
                                    <div className="ParseSelectItem Width378" onClick={() => setCategory('shoes')}>Обувь</div>
                                    <div className="ParseSelectItem Width378" onClick={() => setCategory('clothes')}>Одежда</div>
                                    {/* <div className="ParseSelectItem" onClick={() => setCategory('accessories')}>Аксессуары</div>
                                        <div className="ParseSelectItem" onClick={() => setCategory('cosmetics')}>Косметика</div>
                                        <div className="ParseSelectItem" onClick={() => setCategory('perfumery')}>Парфюмерия</div> */}
                                </div>
                            }
                        </div>
                        <div className="SearchInputBox MT10">
                            <label>timeElapsed (необязательно)</label>
                            <input className="CRMParseInput" value={timeElapsed2} onChange={handleTimeElapsed2} />
                        </div>
                        <div className={`CRMDownloadBtn Width350 ${checked.length > 0 && brand.length > 0 && model.length > 0 && ((category === 'clothes' && declension.length > 0) || category !== 'clothes') ? '' : 'Inactive'}`} onClick={handleDownload}>
                            <RxDownload size={16} />
                            <span>Загрузить выбранное</span>
                        </div>
                    </div>
                </div>
            }
            {parseTab === 'link' &&
                <>
                    <div className="CRMParseRow">
                        <div className="CRMParseCol">
                            <div className="CRMParseSub">Добавление товаров по ссылке</div>
                            <div className="SearchInputBox">
                                <label>Ссылка на товар</label>
                                <input className="CRMParseInput ParseLink" maxLength={255} value={link} onChange={handleLink} />
                            </div>
                            <div className="BrandInputBox">
                                <label>{placeholder1}</label>
                                <input className="CRMParseInput BrandInput" maxLength={255} value={brand} onChange={handleBrand} />
                                {declensionLoader && category === 'clothes' &&
                                    <div className="InputLoader"></div>
                                }
                                {autocomplete.length > 0 &&
                                    <div className="AutocompleteBrand Width378">
                                        {autocomplete.map((item, index) => {
                                            return (
                                                <div
                                                    key={index}
                                                    className="AutocompleteItemBrand"
                                                    onClick={() => {
                                                        setBrand(item.brand.trim())
                                                        autoDeclension(item.brand.trim())
                                                        autoConstants(item.brand.trim())
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
                            {placeholder3 &&
                                <div className="ModelInputBox">
                                    <label>{placeholder3}</label>
                                    <input className="CRMParseInput ModelInput" maxLength={255} value={declension} onChange={(e) => setDeclension(e.target.value)} />
                                </div>
                            }
                            {placeholder3 &&
                                <div className="ModelInputBox">
                                    <label>Стандарт доставка</label>
                                    <input className="CRMParseInput ModelInput" maxLength={255} value={slowShip} onChange={(e) => handleShip(e, 'standart')} />
                                    {standartLoader && category === 'clothes' &&
                                        <div className="InputLoader"></div>
                                    }
                                </div>
                            }
                            {placeholder3 &&
                                <div className="ModelInputBox">
                                    <label>Экспресс доставка</label>
                                    <input className="CRMParseInput ModelInput" maxLength={255} value={fastShip} onChange={(e) => handleShip(e, 'express')} />
                                    {expressLoader && category === 'clothes' &&
                                        <div className="InputLoader"></div>
                                    }
                                </div>
                            }
                            <div className="ModelInputBox">
                                <label>{placeholder2}</label>
                                <input className="CRMParseInput ModelInput" maxLength={255} value={model} onChange={handleModel} />
                                {autocomplete2.length > 0 &&
                                    <div className="AutocompleteBrand Width378">
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
                            <div className="ParseSelect Width350" onClick={() => setListOpen(!listOpen)}>
                                <span>{categories[category]}</span>
                                {listOpen ?
                                    <IoIosArrowUp size={14} />
                                    :
                                    <IoIosArrowDown size={14} />
                                }
                                {listOpen &&
                                    <div className="ParseSelectList Width378">
                                        <div className="ParseSelectItem Width378" onClick={() => setCategory('shoes')}>Обувь</div>
                                        <div className="ParseSelectItem Width378" onClick={() => setCategory('clothes')}>Одежда</div>
                                        {/* <div className="ParseSelectItem" onClick={() => setCategory('accessories')}>Аксессуары</div>
                                        <div className="ParseSelectItem" onClick={() => setCategory('cosmetics')}>Косметика</div>
                                        <div className="ParseSelectItem" onClick={() => setCategory('perfumery')}>Парфюмерия</div> */}
                                    </div>
                                }
                            </div>
                            <div className="SearchInputBox MT10">
                                <label>timeElapsed (необязательно)</label>
                                <input className="CRMParseInput" value={timeElapsed2} onChange={handleTimeElapsed2} />
                            </div>
                            <div className={`CRMDownloadBtn Width350 ${link.length > 0 && brand.length > 0 && model.length > 0 && ((category === 'clothes' && declension.length > 0) || category !== 'clothes') ? '' : 'Inactive'}`} onClick={handleDownload2}>
                                <RxDownload size={16} />
                                <span>Загрузить</span>
                            </div>
                        </div>
                    </div>
                    {isDownloading &&
                        <div className="LoaderBox2">
                            <div className="Loader"></div>
                        </div>
                    }
                </>
            }
            {parseTab === 'search' &&
                <>
                    {loading ?
                        <div className="LoaderBox2">
                            <div className="Loader"></div>
                        </div>
                        : (parsed.productList && parsed.productList.length > 0) ?
                            <>
                                <div className="CRMParseTableBox">
                                    <table className="CRMParseTable">
                                        <thead>
                                            <tr>
                                                <th>
                                                    <input
                                                        className="CRMItemCheck"
                                                        type="checkbox"
                                                        id="itemCheck"
                                                        onChange={checkAll}
                                                        checked={parsed.productList.map(item => item.spuId).every(id => checked.includes(id))}
                                                    />
                                                </th>
                                                <th>id</th>
                                                <th>Фото</th>
                                                <th>Название</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {parsed.productList.map((item, i) => {
                                                return (
                                                    <tr
                                                        key={i}
                                                        className=
                                                        {`
                                                            ${item.isTried ? 'ParsedTried' :
                                                                item.noSizes ? 'ParsedNoSizes' :
                                                                    item.invalidSizes ? 'ParsedInvalidSizes' :
                                                                        item.isExist ? 'ParsedExist' : ''
                                                            }`}
                                                    >
                                                        <td>
                                                            <input
                                                                className="CRMItemCheck"
                                                                type="checkbox"
                                                                id="itemCheck"
                                                                onChange={() => handleCheck(item.spuId)}
                                                                checked={checked.includes(item.spuId)}
                                                            />
                                                        </td>
                                                        <Item item={item} />
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                    {isDownloading &&
                                        <div className="LoaderModal">
                                            <div className="LoaderBox4">
                                                <div className="Loader"></div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </>
                            : wasParsed &&
                            <div className="CRMParseNotFound">Ничего не найдено</div>
                    }
                    {(!loading && error) &&
                        <div className="CRMParseNotFound">Ошибка на стороне API</div>
                    }
                    {(!loading && error2) &&
                        <div className="CRMParseNotFound">Товар не найден</div>
                    }
                </>
            }
            {parseTab === 'deleted' && deleted_items.items && deleted_items.items.length > 0 &&
                <>
                    <div className="CRMItemsTableBox MT26">
                        <table className="CRMItemsTable NonHoverable">
                            <thead>
                                <tr>
                                    <th>id</th>
                                    <th>Фото</th>
                                    <th>Название</th>
                                    <th>Причина удаления</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deleted_items.items.map((item, i) => {
                                    return (
                                        <Fragment key={i}>
                                            <tr
                                                className="CRMItemTr"
                                            >
                                                <Item item={item} />
                                            </tr>
                                        </Fragment>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className={`CRMPag`}>
                        <Pagination totalPages={totalPages} onSelectPage={handleSelectPage} />
                    </div>
                </>
            }
        </div>
    )
})