import { $host } from '.'

export const fetchCities = async () => {
    const { data } = await $host.get('api/cdek')
    return data
}

export const fetchPoints = async () => {
    const { data } = await $host.get('api/cdek/points')
    return data
}