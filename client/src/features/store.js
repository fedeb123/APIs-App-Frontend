import { configureStore } from '@reduxjs/toolkit'

//Persistence
import { persistStore, persistReducer } from 'redux-persist'
import storage from "redux-persist/lib/storage"
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

import productosReducer from './productosSlice'
import authReducer from './authSlice'
import categoriasReducer from './categoriasSlice'
import usuariosReducer from './usuariosSlice'
import { attachInterceptor } from './interceptor/axios' 
import pedidosReducer from "./pedidosSlice"

const persistConfig = {
    key: "root",
    storage,
    stateReconciler: autoMergeLevel2,
    whitelist: ["auth"]
}

const rootReducer = {
    productos: productosReducer,
    auth: authReducer,
    categorias: categoriasReducer,
    pedidos: pedidosReducer,
    usuarios: usuariosReducer
}

const persistedReducer = persistReducer(persistConfig, (state, action) => {
    return state;
})

const store = configureStore({
    reducer: {
        productos: productosReducer,
        auth: authReducer,
        categorias: categoriasReducer,
        pedidos: pedidosReducer,
        usuarios: usuariosReducer
    }
});

export const persistor = persistStore(store)

attachInterceptor(store);

export default store;