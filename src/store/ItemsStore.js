import {makeAutoObservable} from 'mobx'

export default class ItemsStore {
    constructor () {
        this._items = []
        this._page = 1
        this._limit = 12
        this._crmLimit = 20
        this._count = 0
        makeAutoObservable(this)
    }

    async setItems(items) {
        this._items = items.rows
        this._count = items.count
    }

    setPage(page) {
        this._page = page
    }

    setLimit(limit) {
        this._limit = limit
    }

    setCRMlimit(limit) {
        this._crmLimit = limit
    }

    setCount(count) {
        this._count = count
    }

    get items() {
        return this._items
    }

    get page() {
        return this._page
    }

    get limit() {
        return this._limit
    }

    get crmLimit() {
        return this._crmLimit
    }

    get count() {
        return this._count
    }
}