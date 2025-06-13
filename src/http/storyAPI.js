import { $authHost, $host } from '.'

export const fetchStories = async (type) => {
    const { data } = await $host.get('api/story', { params: { type } })
    return data
}

export const createStories = async (type, img) => {
    const formData = new FormData()
    formData.append('type', type)
    formData.append('img', img)
    
    const { data } = await $authHost.post('api/story', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return data
}