import React, { useEffect, useState } from "react";
import usePagination from '@mui/material/usePagination';
import './Pagination.scss'

import arr from './img/arr.svg'

export const Pagination = ({ onSelectPage, totalPages }) => {
    const [currentPage, setCurrentPage] = useState(1)

    const { items } = usePagination({
        count: totalPages,
        page: currentPage,
        onChange: (e, page) => setCurrentPage(page)
    })

    useEffect(() => {
        onSelectPage(items.filter(item => item.selected)[0]?.page)
        // eslint-disable-next-line
    }, [items])

    useEffect(() => {
        setCurrentPage(1)
    }, [totalPages])

    return (
        <div className="Pagination">
            {items.map(({ page, type, selected, ...item }, index) => {
                let children = null

                if (type === 'start-ellipsis' || type === 'end-ellipsis') {
                    children = (
                        <div className="PagDots">...</div>
                    )
                } else if (type === 'page') {
                    children = (
                        <button
                            className={`PagNum ${selected ? 'PagNumSelected' : ''}`}
                            type="button"
                            {...item}
                        >
                            {page}
                        </button>
                    )
                } else {
                    children = (
                        <button className={`PagArr${type}`} type="button" {...item}>
                            <img src={arr} alt="arr" />
                        </button>
                    )
                }

                return <li key={index}>{children}</li>
            })}
        </div>
    )
}
