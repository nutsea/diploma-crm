import { $host } from '.'

export const fetchSizes = async (size_type, item_category) => {
    const { data } = await $host.get('api/size', { params: { size_type, item_category } })
    return data
}

export const fetchMinMaxPrice = async (item_category) => {
    const { data } = await $host.get('api/size/price', { params: { item_category } })
    return data
}

export const fetchSizePrice = async (size_type, item_category, size) => {
    const { data } = await $host.get('api/size/sizeprice', { params: { size_type, item_category, size } })
    return data
}