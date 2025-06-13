import React, { useEffect, useRef } from "react"
import "./OrderSlider.scss"
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import { Pagination } from "swiper/modules";

export const OrderSlider = ({ item, num }) => {
    const swiperRef = useRef(null)

    const setImages = () => {
        const oldPagination = document.querySelectorAll('.swiper-pagination-bullet')
        for (let i = 0; i < oldPagination.length; i++) {
            if (item[i] && item[i].img) {
                oldPagination[i].classList.add('OrderSmallImg')
                if (!oldPagination[i].hasChildNodes()) {
                    oldPagination[i].innerHTML = `<img class="OrderSmallImgStyle" src=${process.env.REACT_APP_IMG_URL + item[i].img} alt="Фото товара" />`
                }
            }
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setImages()
            const hasChildNodes = Array.from(document.querySelectorAll('.swiper-pagination-bullet')).every(pagination => pagination.hasChildNodes())
            // const images = Array.from(document.querySelectorAll('.OrderSmallImgStyle'))
            // if (hasChildNodes.length === images.length) {
            if (hasChildNodes) {
                clearInterval(interval)
                swiperRef.current.slideTo(num)
            }
        }, 10)
        // eslint-disable-next-line
    }, [])

    return (
        <>
            <div className="OrderItemImagesSmall"></div>
            <div className="OrderBigImgSliderBox">
                <div className="OrderBigImgSlider">
                    <Swiper
                        modules={[Pagination]}
                        className="mySwiper"
                        loop={true}
                        pagination={{
                            el: '.OrderItemImagesSmall',
                            clickable: true
                        }}
                        onSwiper={(swiper) => swiperRef.current = swiper}
                    >
                        {item && item.map((img, i) => {
                            return (
                                <SwiperSlide key={i}>
                                    <img
                                        key={i}
                                        className="OrderBigImg"
                                        src={process.env.REACT_APP_IMG_URL + img.img}
                                        alt="Фото товара"
                                    />
                                </SwiperSlide>
                            )
                        })}
                    </Swiper>
                </div>
            </div>
        </>
    )
}