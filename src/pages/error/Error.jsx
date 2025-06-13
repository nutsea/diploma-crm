import React from "react";
import { useNavigate } from 'react-router-dom';

import './Error.scss'

import star from '../../assets/star.svg'
import oops from '../../assets/oops.png'

export const Error = () => {
    const navigate = useNavigate()

    const handleNavigate = (e) => {
        navigate(e.target.id)
        window.scrollTo({
            top: 0,
            // behavior: 'smooth'
        })
    }
    return (
        <div className="ErrorBox">
            <div className="ErrorContainer">
                <img className="ErrorText" src={oops} alt="УПС" />
                <div className="ErrorSub">Страница не найдена!</div>
                <p className="ErrorPar">Кажется, вы попали не туда. Возможно, эта страница была перемещена или удалена.</p>
                <div className="BackToMain" id="/" onClick={handleNavigate}>Вернуться на главную</div>
            </div>
            <img className="StarImg Star1" src={star} alt="" />
            <img className="StarImg Star2" src={star} alt="" />
            <img className="StarImg Star3" src={star} alt="" />
            <img className="StarImg Star4" src={star} alt="" />
            <img className="StarImg Star5" src={star} alt="" />
            <img className="StarImg Star6" src={star} alt="" />
            <img className="StarImg Star7" src={star} alt="" />
            <img className="StarImg Star8" src={star} alt="" />
            <img className="StarImg Star9" src={star} alt="" />
            <img className="StarImg Star10" src={star} alt="" />
            <img className="StarImg Star11" src={star} alt="" />
            <img className="StarImg Star12" src={star} alt="" />
            <img className="StarImg Star13" src={star} alt="" />
            <img className="StarImg Star14" src={star} alt="" />
            <img className="StarImg Star15" src={star} alt="" />
            <img className="StarImg Star16" src={star} alt="" />
        </div>
    )
}