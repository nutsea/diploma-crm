import { $authHost } from '.'

export const sendOrder = async (name, social_media, checked_price, recipient, phone, address, ship_type, delivery_cost, is_split, course, fee, cost, discount_cost, discount, promo_code, items) => {
    const { data } = await $authHost.post('api/order', { name, social_media, checked_price, recipient, phone, address, ship_type, delivery_cost, is_split, course, fee, cost, discount_cost, discount, promo_code, items })
    return data
}

export const fetchClientOrders = async () => {
    const { data } = await $authHost.get('api/order/client')
    return data
}

export const fetchOrderItems = async (id) => {
    const { data } = await $authHost.get('api/order/items', { params: { id } })
    return data
}

export const fetchOrderReport = async (id, type) => {
    const { data } = await $authHost.get('api/order/report', { params: { id, type } })
    return data
}

export const fetchOrders = async (search, statuses) => {
    const { data } = await $authHost.get('api/order', { params: { search, statuses } })
    return data
}

export const fetchOrdersIn = async (search) => {
    const { data } = await $authHost.get('api/order/in', { params: { search } })
    return data
}

export const updateStatus = async (id, status) => {
    const { data } = await $authHost.put('api/order/status', { id, status })
    return data
}

export const updateOrder = async (id, status, recipient, phone, ship_type, comment, address, track, cdekTrack, dimensions, cargo_cost, sdek_cost, first_pay, second_pay, firstPaid, secondPaid, paid, canReview, fee, cost, social_media_type, social_media, delivery_cost) => {
    const { data } = await $authHost.put('api/order/update', { id, status, recipient, phone, ship_type, comment, address, track, cdekTrack, dimensions, cargo_cost, sdek_cost, first_pay, second_pay, firstPaid, secondPaid, paid, canReview, fee, cost, social_media_type, social_media, delivery_cost })
    return data
}

export const fetchOrder = async (id) => {
    const { data } = await $authHost.get('api/order/one', { params: { id } })
    return data
}

export const updateOrderItems = async (idArr, statuses, orderNums, trackNums, pricesCNY, pricesRUB, fees, deliveries) => {
    const { data } = await $authHost.put('api/order/items', { idArr, statuses, orderNums, trackNums, pricesCNY, pricesRUB, fees, deliveries })
    return data
}

export const fetchOrderPhotos = async (id) => {
    const { data } = await $authHost.get('api/order/photos', { params: { id } })
    return data
}

export const setOrderPhoto = async (id, type, img) => {
    const formData = new FormData()
    formData.append('id', id)
    formData.append('type', type)
    formData.append('img', img)

    const { data } = await $authHost.post('api/order/photo', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return data
}

export const addItemToOrder = async (id, item_uid, img, name, category, size, ship, cny_cost, rub_cost, delivery_cost, fee) => {
    const { data } = await $authHost.post('api/order/itemtoorder', { id, item_uid, img, name, category, size, ship, cny_cost, rub_cost, delivery_cost, fee })
    return data
}

export const createByAdmin = async (name, surname, social_media, recipient, phone, address, ship_type, is_split, first_pay, second_pay, first_paid, second_paid, paid, course, cost, discount, promo_code, comment, can_review, status, items, social_media_type, client_id) => {
    const { data } = await $authHost.post('api/order/byadmin', { name, surname, social_media, recipient, phone, address, ship_type, is_split, first_pay, second_pay, first_paid, second_paid, paid, course, cost, discount, promo_code, comment, can_review, status, items, social_media_type, client_id })
    return data
}

export const deleteOrderPhoto = (id) => {
    return $authHost.delete('api/order_photo', { params: { id } })
}

export const fetchUserOrders = async (id) => {
    const { data } = await $authHost.get('api/order/user', { params: { id } })
    return data
}