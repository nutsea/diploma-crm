import { $authHost } from '.'

export const addToFav = async (item_uid, client_id) => {
    const { data } = await $authHost.post('api/fav', { item_uid, client_id })
    return data
}

export const findUserFav = async (client_id) => {
    const { data } = await $authHost.get('api/fav', { params: { client_id } })
    return data
}

export const deleteFromFav = async (item_uid, client_id) => {
    const { data } = await $authHost.delete('api/fav', { params: { item_uid, client_id } })
    return data
}