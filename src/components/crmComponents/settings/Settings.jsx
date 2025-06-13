import React, { useContext, useEffect, useState } from "react";
import './Settings.scss';
import { observer } from "mobx-react-lite";
import { Context } from "../../..";

import checkImg from '../imgs/check.svg'
import { fetchCategoriesShip, fetchCourse, fetchExpressShip, fetchFee, fetchStandartShip, updateCategoryShip, updateConstants } from "../../../http/constantsAPI";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

export const Settings = observer(() => {
    const { constants } = useContext(Context)
    const [course, setCourse] = useState('')
    const [standartShip, setStandartShip] = useState('')
    const [expressShip, setExpressShip] = useState('')
    const [standartClo, setStandartClo] = useState('')
    const [expressClo, setExpressClo] = useState('')
    const [fee, setFee] = useState('')
    const [loadingCourse, setLoadingCourse] = useState(false)
    const [loadingStandartShip, setLoadingStandartShip] = useState(false)
    const [loadingExpressShip, setLoadingExpressShip] = useState(false)
    const [loadingStandartClo, setLoadingStandartClo] = useState(false)
    const [loadingExpressClo, setLoadingExpressClo] = useState(false)
    const [loadingFee, setLoadingFee] = useState(false)
    const [listOpen, setListOpen] = useState(false)
    const [category, setCategory] = useState('')
    const [categories, setCategories] = useState([])

    const updateConstant = async (name, value) => {
        if (Number(value) === 0) {
            return
        }
        if (name === 'course') {
            setLoadingCourse(true)
            setCourse('')
        }
        if (name === 'standartShip') {
            setLoadingStandartShip(true)
            setStandartShip('')
        }
        if (name === 'expressShip') {
            setLoadingExpressShip(true)
            setExpressShip('')
        }
        if (name === 'fee') {
            setLoadingFee(true)
            setFee('')
        }

        await updateConstants(name, Number(value)).then(async () => {
            await fetchCourse().then(data => {
                constants.setCourse(data.value)
                setLoadingCourse(false)
            })
            await fetchStandartShip().then(data => {
                constants.setStandartShip(data.value)
                setLoadingStandartShip(false)
            })
            await fetchExpressShip().then(data => {
                constants.setExpressShip(data.value)
                setLoadingExpressShip(false)
            })
            await fetchFee().then(data => {
                constants.setFee(data.value)
                setLoadingFee(false)
            })
        })
    }

    const updateClothesShip = async (type) => {
        if (type === 'express') setLoadingExpressClo(true)
        if (type === 'standart') setLoadingStandartClo(true)
        await updateCategoryShip(category.name, expressClo, standartClo, type).then(() => {
            findClothesCategories()
            if (type === 'express') setExpressClo('')
            if (type === 'standart') setStandartClo('')
        })
    }

    const handleChange = (e) => {
        const value = e.target.value.replace(/[^0-9.]/g, '')
        if (e.target.name === 'course') {
            setCourse(value)
        }
        if (e.target.name === 'standartShip') {
            setStandartShip(value)
        }
        if (e.target.name === 'expressShip') {
            setExpressShip(value)
        }
        if (e.target.name === 'standartClo') {
            setStandartClo(value)
        }
        if (e.target.name === 'expressClo') {
            setExpressClo(value)
        }
        if (e.target.name === 'fee') {
            setFee(value)
        }
    }

    const findClothesCategories = async () => {
        await fetchCategoriesShip().then(data => {
            const mergedCategories = Object.values([...data.fastConstants, ...data.slowConstants].reduce((acc, item) => {
                const { name, type, value } = item

                if (!acc[name]) {
                    acc[name] = { name }
                }

                acc[name][type] = value
                return acc
            }, {}))
            setCategories(Object.values(mergedCategories))
            constants.setCategoriesShips(data)
            setLoadingStandartClo(false)
            setLoadingExpressClo(false)
            console.log(mergedCategories)
            setCategory(mergedCategories.find(i => i.name === category.name))
        })
    }

    useEffect(() => {
        findClothesCategories()
        // eslint-disable-next-line
    }, [])

    return (
        <div className="CRMSettings">
            <div className="CRMSettingsSub">Курс CNY</div>
            <div className="CRMSettingsPar">Текущий курс - {constants.course} ₽</div>
            <div className="CRMSettingsInputBox">
                <input className="CRMSettingsInput" value={course} name="course" onChange={handleChange} placeholder="Курс" />
                <div className={`CRMSettingsBtn ${Number(course) ? 'Active' : ''}`} onClick={() => updateConstant('course', course)}>
                    <img src={checkImg} alt="" />
                </div>
                {loadingCourse &&
                    <div className="InputLoader"></div>
                }
            </div>
            <div className="CRMSettingsLine"></div>
            <div className="CRMSettingsSub">Стоимость стандартной доставки обуви</div>
            <div className="CRMSettingsPar">Текущая стоимость - {constants.standartShip} ₽</div>
            <div className="CRMSettingsInputBox">
                <input className="CRMSettingsInput" value={standartShip} name="standartShip" onChange={handleChange} placeholder="Стоимость" />
                <div className={`CRMSettingsBtn ${Number(standartShip) ? 'Active' : ''}`} onClick={() => updateConstant('standartShip', standartShip)}>
                    <img src={checkImg} alt="" />
                </div>
                {loadingStandartShip &&
                    <div className="InputLoader"></div>
                }
            </div>
            <div className="CRMSettingsLine"></div>
            <div className="CRMSettingsSub">Стоимость экспресс доставки обуви</div>
            <div className="CRMSettingsPar">Текущая стоимость - {constants.expressShip} ₽</div>
            <div className="CRMSettingsInputBox">
                <input className="CRMSettingsInput" value={expressShip} name="expressShip" onChange={handleChange} placeholder="Стоимость" />
                <div className={`CRMSettingsBtn ${Number(expressShip) ? 'Active' : ''}`} onClick={() => updateConstant('expressShip', expressShip)}>
                    <img src={checkImg} alt="" />
                </div>
                {loadingExpressShip &&
                    <div className="InputLoader"></div>
                }
            </div>
            <div className="CRMSettingsLine"></div>
            <div className="CRMSettingsSub">Стоимость доставки одежды</div>
            {category &&
                <>
                    <div className="CRMSettingsPar">Текущий стандарт - {category.standart} ₽</div>
                    <div className="CRMSettingsPar">Текущий экспресс - {category.express} ₽</div>
                </>
            }
            <div className="ParseSelect SettingsSelect" onClick={() => setListOpen(!listOpen)}>
                <span>{category ? category.name : 'Категория'}</span>
                {listOpen ?
                    <IoIosArrowUp size={14} />
                    :
                    <IoIosArrowDown size={14} />
                }
                {listOpen &&
                    <div className="ParseSelectList">
                        {/* <div className="ParseSelectItem" onClick={() => setCategory('shoes')}>Обувь</div>
                        <div className="ParseSelectItem" onClick={() => setCategory('clothes')}>Одежда</div> */}
                        {categories.map((item, i) => {
                            return (
                                <div key={i} className="ParseSelectItem" onClick={() => setCategory(item)}>{item.name}</div>
                            )
                        })}
                    </div>
                }
            </div>
            <div className="CRMSettingsInputBox">
                <input className="CRMSettingsInput" value={standartClo} name="standartClo" onChange={handleChange} placeholder="Стандарт" />
                <div className={`CRMSettingsBtn ${Number(standartClo) && category ? 'Active' : ''}`} onClick={() => updateClothesShip('standart')}>
                    <img src={checkImg} alt="" />
                </div>
                {loadingStandartClo &&
                    <div className="InputLoader"></div>
                }
            </div>
            <div className="CRMSettingsInputBox">
                <input className="CRMSettingsInput" value={expressClo} name="expressClo" onChange={handleChange} placeholder="Экспресс" />
                <div className={`CRMSettingsBtn ${Number(expressClo) && category ? 'Active' : ''}`} onClick={() => updateClothesShip('express')}>
                    <img src={checkImg} alt="" />
                </div>
                {loadingExpressClo &&
                    <div className="InputLoader"></div>
                }
            </div>
            <div className="CRMSettingsLine"></div>
            <div className="CRMSettingsSub">Комиссия</div>
            <div className="CRMSettingsPar">Текущая комиссия - {constants.fee} ₽</div>
            <div className="CRMSettingsInputBox">
                <input className="CRMSettingsInput" value={fee} name="fee" onChange={handleChange} placeholder="Комиссия" />
                <div className={`CRMSettingsBtn ${Number(fee) ? 'Active' : ''}`} onClick={() => updateConstant('fee', fee)}>
                    <img src={checkImg} alt="" />
                </div>
                {loadingFee &&
                    <div className="InputLoader"></div>
                }
            </div>
        </div>
    )
})