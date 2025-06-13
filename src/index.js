import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'
import { App } from './App';
import StoriesStore from './store/StoriesStore';
import ItemsStore from './store/ItemsStore';
import ConstantsStore from './store/ConstantsStore';
import CartStore from './store/CartStore';
import FavStore from './store/FavStore';
import BrandStore from './store/BrandStore';
import UserStore from './store/UserStore';
import DeletedItemsStore from './store/DeletedItemsStore';

export const Context = createContext(null)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router>
        <Context.Provider value={{
            stories: new StoriesStore(),
            items: new ItemsStore(),
            constants: new ConstantsStore(),
            user_cart: new CartStore(),
            user_fav: new FavStore(),
            brand_check: new BrandStore(),
            user_store: new UserStore(),
            deleted_items: new DeletedItemsStore()
        }}>
            <App />
        </Context.Provider>
    </Router>
);