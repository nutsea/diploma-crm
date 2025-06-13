import React from "react"
import { useEffect } from "react"
import { useState } from "react"
import { fetchUser } from "../../../../http/userAPI"

export const Manager = ({ order }) => {
    const [manager, setManager] = useState('')

    const findManager = async () => {
        await fetchUser(order.manager).then(data => {
            if (data && data.name)
                setManager(data.name)
        })
    }

    useEffect(() => {
        if (order.manager) {
            findManager()
        }
        // eslint-disable-next-line
    }, [order])

    return (
        <>{manager ? manager : '‒'}</>
    )
}