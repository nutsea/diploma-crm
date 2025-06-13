import {makeAutoObservable} from 'mobx'

export default class StoriesStore {
    constructor () {
        this._stories = []
        makeAutoObservable(this)
    }

    async setStories(stories) {
        this._stories = stories
    }

    get stories() {
        return this._stories
    }
}