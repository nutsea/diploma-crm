import { makeAutoObservable } from 'mobx'

export default class FavStore {
    constructor() {
        this._fav = []
        makeAutoObservable(this)
    }

    async setFav(fav) {
        this._fav = fav
    }

    get fav() {
        return this._fav
    }
}