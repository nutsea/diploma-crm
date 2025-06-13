import { $host } from '.'

export const checkPromo = async (promo_code) => {
    const { data } = await $host.get('api/promo/check', { params: { promo_code } })
    return data
}