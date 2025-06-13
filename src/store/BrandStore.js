import { makeAutoObservable } from 'mobx'

export default class BrandStore {
    constructor() {
        this._brand = []
        makeAutoObservable(this)
    }

    async setBrand(brand) {
        this._brand = brand
    }

    get brand() {
        return this._brand
    }
}