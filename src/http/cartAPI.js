import { $authHost } from '.'

export const addToCart = async (item_uid, size, client_id, ship) => {
    const { data } = await $authHost.post('api/cart', { item_uid, size, client_id, ship })
    return data
}

export const findUserCart = async (client_id) => {
    const { data } = await $authHost.get('api/cart', { params: { client_id } })
    return data
}

export const deleteFromCart = async (id, size, user, ship) => {
    const { data } = await $authHost.delete('api/cart', { params: { id, size, user, ship } })
    return data
}

export const clearUserCart = async () => {
    const { data } = await $authHost.delete('api/cart/clear')
    return data
}