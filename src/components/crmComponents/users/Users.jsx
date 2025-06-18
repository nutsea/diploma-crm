import React, { useEffect, useState } from "react";
import './Users.scss';

import loop1 from '../../../assets/loop1.svg'
import { createSyncKey, fetchUser, fetchUsers, updateRoles } from "../../../http/userAPI";
import { RxUpdate } from "react-icons/rx";
import { TbCopy, TbCopyCheckFilled } from "react-icons/tb";
import { UserCard } from "../userCard/UserCard";

export const Users = ({ userId, onOrder }) => {
    const [search, setSearch] = useState('')
    const [isFocus, setIsFocus] = useState(false)
    const [users, setUsers] = useState([])
    const [checked, setChecked] = useState([])
    const [isUpdateModal, setIsUpdateModal] = useState(false)
    const [role, setRole] = useState('admin')
    const [loading, setLoading] = useState(true)
    const [copied, setCopied] = useState('')
    const [chosenUser, setChosenUser] = useState(null)

    const handleChooseUser = (e, user) => {
        if (e.target.closest('.noClick')) return
        else {
            setChosenUser(user)
        }
    }

    const findUsers = async () => {
        try {
            setLoading(true)
            setUsers([])
            setChecked([])
            await fetchUsers(search).then(data => {
                setUsers(data)
                setLoading(false)
            })
        } catch (e) {

        }
    }

    const findUser = async () => {
        try {
            await fetchUser(userId).then(data => {
                setChosenUser(data)
            })
        } catch (e) {

        }
    }

    const handleBackUser = () => {
        setChosenUser(null)
    }

    const handleUpdateRoles = async () => {
        await updateRoles(checked, role).then(data => {
            findUsers()
            setIsUpdateModal(false)
        })
    }

    const checkAll = () => {
        if (users.map(user => user.id).every(id => checked.includes(id))) {
            setChecked(checked.filter(id => !users.map(user => user.id).includes(id)))
            const checkboxes = document.querySelectorAll('#itemCheck')
            checkboxes.forEach(checkbox => {
                checkbox.checked = false
            })
        } else {
            setChecked(users.map(user => user.id))
            const checkboxes = document.querySelectorAll('#itemCheck')
            checkboxes.forEach(checkbox => {
                checkbox.checked = true
            })
        }
    }

    const handleCheck = (id) => {
        if (checked.includes(id)) {
            setChecked(checked.filter(i => i !== id))
        } else {
            setChecked([...checked, id])
        }
    }

    const formatPhone = (phone) => {
        if (phone)
            return `+${phone.slice(0, 1)} (${phone.slice(1, 4)}) ${phone.slice(4, 7)}-${phone.slice(7, 9)}-${phone.slice(9, 11)}`
        else return '‒'
    }

    const generateKey = async (id) => {
        await createSyncKey(id).then(data => {
            findUsers()
        })
    }

    const handleCopy = async (user) => {
        await navigator.clipboard.writeText(user.sync_key)
        setCopied(user.id)
    }

    const formatDate = (date) => {
        const newDate = new Date(date);
        const day = newDate.getDate().toString().padStart(2, '0');
        const month = (newDate.getMonth() + 1).toString().padStart(2, '0');
        const year = newDate.getFullYear().toString();
        return `${day}.${month}.${year}`;
    }

    useEffect(() => {
        findUsers()
        // eslint-disable-next-line
    }, [search])

    useEffect(() => {
        findUser()
        // eslint-disable-next-line
    }, [userId])

    return (
        <div className="CRMUsers">
            {chosenUser ?
                <UserCard user={chosenUser} onBack={handleBackUser} onOrder={onOrder} onKey={findUsers} onUpdate={findUsers} />
                :
                <>
                    <div className={`CRMSearchItems ${isFocus ? 'Focused' : ''}`}>
                        <img src={loop1} alt="Поиск" />
                        <input
                            type="text"
                            placeholder='Поиск по пользователям'
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    {users && users.length > 0 &&
                        <>
                            <div className="CRMItemsChecked">Выбрано: {checked.length}</div>
                            <div className="CRMItemsBtns">
                                <div className={`CRMItemsUpdateBtn ${checked.length > 0 ? '' : 'Inactive'}`} onClick={() => setIsUpdateModal(true)}>
                                    <RxUpdate size={16} />
                                    <span>Назначить роль</span>
                                </div>
                            </div>
                        </>
                    }
                    {loading &&
                        <div className="LoaderBox2">
                            <div className="Loader"></div>
                        </div>
                    }
                    {isUpdateModal &&
                        <div className="CRMDeleteModalBox">
                            <div className="CRMDeleteModal">
                                <div className="CRMDeleteModalTitle UsersAddRole">Назначить роль выбранным пользователям</div>
                                {users.map((user, i) => {
                                    if (checked.includes(user.id))
                                        return (
                                            <div key={i} className="UserAddRole">{user.name} {formatPhone(user.phone)}</div>
                                        )
                                    else return null
                                })}
                                <div className="CheckRole">
                                    <input type="checkbox" checked={role === 'main'} onChange={() => setRole('main')} />
                                    <span>Главный</span>
                                </div>
                                <div className="CheckRole">
                                    <input type="checkbox" checked={role === 'admin'} onChange={() => setRole('admin')} />
                                    <span>Администратор</span>
                                </div>
                                <div className="CheckRole">
                                    <input type="checkbox" checked={role === 'client'} onChange={() => setRole('client')} />
                                    <span>Клиент</span>
                                </div>
                                <div className="CRMDeleteModalBtns">
                                    <div
                                        className="CRMDeleteModalBtn DeleteModalBtnCancel"
                                        onClick={() => {
                                            setIsUpdateModal(false)
                                        }}
                                    >
                                        Отмена
                                    </div>
                                    <div className="CRMDeleteModalBtn DeleteModalBtnUpdate" onClick={handleUpdateRoles}>Назначить</div>
                                </div>
                            </div>
                        </div>
                    }
                    {users && users.length > 0 ?
                        <div className="CRMItemsTableBox">
                            <table className="CRMItemsTable">
                                <thead>
                                    <tr>
                                        <th>
                                            <input
                                                className="CRMItemCheck"
                                                type="checkbox"
                                                id="itemCheck"
                                                onChange={checkAll}
                                                checked={users.map(item => item.id).every(id => checked.includes(id))}
                                            />
                                        </th>
                                        <th>Telegram</th>
                                        <th>VK</th>
                                        <th>Клиент</th>
                                        {/* <th>Фамилия</th> */}
                                        <th>Телефон</th>
                                        <th>Роль</th>
                                        <th>Регистрация</th>
                                        <th>Ключ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user, i) => {
                                        return (
                                            <tr key={i} onClick={(e) => handleChooseUser(e, user)}>
                                                <td className="noClick">
                                                    <input
                                                        className="CRMItemCheck noClick"
                                                        type="checkbox"
                                                        id="itemCheck"
                                                        onChange={() => handleCheck(user.id)}
                                                        checked={checked.includes(user.id)}
                                                    />
                                                </td>
                                                <td className="CRMItemName">{user.link_type && user.link_type !== 'tg' ? user.link_type : '‒'}</td>
                                                <td className="CRMItemName">{user.link ? user.link : '‒'}</td>
                                                <td className="CRMItemName">{user.client ? user.client : '‒'}</td>
                                                <td className="CRMItemName">{formatPhone(user.phone)}</td>
                                                <td className={`CRMItemName ${user.role === 'main' || user.role === 'admin' ? 'RedRole' : ''}`}>
                                                    {user.role === 'main' ? 'Главный' : user.role === 'admin' ? 'Администратор' : user.role === 'dev' ? 'Разработчик' : 'Клиент'}
                                                </td>
                                                <td className="CRMItemName">{formatDate(user.createdAt)}</td>
                                                <td className="CRMItemName noClick">
                                                    {user.sync_key ?
                                                        <span className="GenerateKey noClick" onClick={() => handleCopy(user)}>
                                                            {copied === user.id ?
                                                                <TbCopyCheckFilled className="CRMItemCopyIcon noClick" style={{ pointerEvents: 'none' }} />
                                                                :
                                                                <TbCopy className="CRMItemCopyIcon noClick" style={{ pointerEvents: 'none' }} />
                                                            }
                                                            <span className="noClick">
                                                                {user.sync_key}
                                                            </span>
                                                        </span>
                                                        :
                                                        <span className="GenerateKey noClick" onClick={() => generateKey(user.id)}>Получить</span>
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                        : !loading &&
                        <div className="CRMItemsEmpty">Пользователи не найдены</div>
                    }
                </>
            }
        </div>
    )
}