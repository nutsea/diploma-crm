import React, { useState } from "react"
import './Stories.scss'
import { createStories } from "../../../http/storyAPI"

const types = [
    { type: 'new', name: 'Релизы' },
    { type: 'select', name: 'Подборки' },
    { type: 'look', name: 'Образы' },
    { type: 'report', name: 'Фотоотчеты' },
    { type: 'review', name: 'Отзывы' },
    { type: 'gift', name: 'Подарочная карта' },
]

export const Stories = () => {
    const [type, setType] = useState('new')
    const [file, setFile] = useState(null)

    const sendStory = async () => {
        if (type && file) {
            await createStories(type, file).then(() => {
                setFile(null)
            })
        }
    }

    return (
        <div className="CRMStories">
            <select onChange={(e) => setType(e.target.value)}>
                {types.map((t, i) =>
                    <option value={t.type}>{t.name}</option>
                )}
            </select>
            <div className="StoriesFileInput">
                <span>{file ? file.name : 'Фото'}</span>
                <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            </div>
            <div className={`StoriesSave ${type && file ? 'Active' : ''}`} onClick={sendStory}>Загрузить</div>
        </div>
    )
}