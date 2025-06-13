import { $authHost, $host } from '.'

export const fetchItems = async (category, brands, models, sizes, size_type, prices, sort, limit, page) => {
    const { data } = await $host.get('api/item/all', { params: { category, brands, models, sizes, size_type, prices, sort, limit, page } })
    return data
}

export const fetchAdminItems = async (limit, page, search) => {
    const { data } = await $host.get('api/item/alladmin', { params: { sort: 'new', limit, page, search } })
    return data
}

export const fetchAdminDeletedItems = async (limit, page) => {
    const { data } = await $host.get('api/item/deletedadmin', { params: { limit, page } })
    return data
}

export const fetchPopularItems = async () => {
    const { data } = await $host.get('api/item/popular')
    return data
}

export const fetchOneItem = async (id) => {
    const { data } = await $host.get('api/item/one', { params: { id } })
    return data
}

export const fetchOneItemBySpu = async (spu) => {
    const { data } = await $host.get('api/item/spuone', { params: { spu } })
    return data
}

export const fetchByIds = async (ids) => {
    const id_arr = JSON.stringify(ids)
    const { data } = await $host.get('api/item/ids', { params: { id_arr } })
    return data
}

export const fetchCartItems = async (ids) => {
    const items_arr = JSON.stringify(ids)
    const { data } = await $host.get('api/item/cart', { params: { items_arr } })
    return data
}

export const fetchBrandsAndModels = async (category) => {
    const { data } = await $host.get('api/item/brands', { params: { category } })
    return data
}

export const checkOrderCost = async (idArr, timeElapsed) => {
    const spuIdArr = JSON.stringify(idArr)
    const { data } = await $host.get('api/item/cost', { params: { spuIdArr, timeElapsed } })
    return data
}

export const deletePhoto = async (id) => {
    const { data } = await $authHost.delete('api/photo', { params: { id } })
    return data
}

export const getSpuIds = async (keyword, limit, page, timeElapsed) => {
    const { data } = await $authHost.get('api/item/spu', { params: { keyword, limit, page, timeElapsed } })
    return data
}

export const getSpuItems = async (spuIdArr, category, timeElapsed, brand, model, declension, fast_ship, slow_ship) => {
    const { data } = await $authHost.post('api/item/spu', { spuIdArr, category, timeElapsed, brand, model, declension, fast_ship, slow_ship })
    return data
}

export const getLinkItem = async (link, category, timeElapsed, brand, model, declension, fast_ship, slow_ship) => {
    const { data } = await $authHost.post('api/item/link', { link, category, timeElapsed, brand, model, declension, fast_ship, slow_ship })
    return data
}

export const updateBrandAndModel = async (spuIdArr, brand, model) => {
    const { data } = await $authHost.put('api/item/updatebrandmodel', { spuIdArr, brand, model })
    return data
}

export const deleteItems = async (idArr) => {
    const { data } = await $authHost.delete('api/item', { params: { idArr } })
    return data
}

export const fetchAutoDeclension = async (brand) => {
    const { data } = await $authHost.get('api/item/autodeclension', { params: { brand } })
    return data
}

export const fetchAutoConstants = async (name) => {
    const { data } = await $authHost.get('api/item/autoconstants', { params: { name } })
    return data
}
