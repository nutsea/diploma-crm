import { $host } from '.'

// export const createAuth = async (code) => {
//     const { data } = await $host.post('api/auth', { code })
//     return data
// }

export const createAuth = async () => {
    const { data } = await $host.post('api/auth/browser')
    return data
}

export const checkAuth = async (code) => {
    try {
        const { data } = await $host.get('api/auth', { params: { code } })
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user.id))
        return data
    } catch (e) {
        // localStorage.removeItem('authcode')
    }
}

export const checkAuthBrowser = async (code) => {
    try {
        const { data } = await $host.get('api/auth/browser', { params: { code } })
        // localStorage.setItem('token', data)
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user.id))
        return data
    } catch (e) {
        // localStorage.removeItem('authcode')
    }
}