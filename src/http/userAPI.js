import { $authHost, $host } from '.'

export const checkUser = async () => {
    const { data } = await $authHost.get('api/user')
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user.id))
    return data
}

export const updateUser = async (name, surname, phone) => {
    const { data } = await $authHost.put('api/user', { name, surname, phone })
    return data
}

export const setPassword = async (password) => {
    const { data } = await $authHost.put('api/user/password', { password })
    return data
}

export const changePassword = async (oldPass, newPass) => {
    const { data } = await $authHost.put('api/user/changePassword', { oldPass, newPass })
    return data
}

export const login = async (phone, password) => {
    const { data } = await $authHost.get('api/user/login', { params: { phone, password } })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user.id))
    return data
}

export const fetchUser = async (id) => {
    const { data } = await $host.get('api/user/one', { params: { id } })
    return data
}

export const fetchUsers = async (search) => {
    const { data } = await $host.get('api/user/all', { params: { search } })
    return data
}

export const updateRoles = async (idArr, role) => {
    const { data } = await $authHost.put('api/user/roles', { idArr, role })
    return data
}

export const getAllUsers = async () => {
    const { data } = await $authHost.get('api/user/users')
    return data
}

export const createSyncKey = async (id) => {
    const { data } = await $authHost.put('api/user/generatekey', { id })
    return data
}

export const createUser = async (name, phone, link, link_type) => {
    const { data } = await $authHost.post('api/user', { name, phone, link, link_type })
    return data
}

export const updateUserByAdmin = async (id, name, surname, phone, link, link_type, role, client) => {
    const { data } = await $authHost.put('api/user/admin', { id, name, surname, phone, link, link_type, role, client })
    return data
}