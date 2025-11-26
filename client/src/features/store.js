import { configureStore } from '@reduxjs/toolkit'

//Persistence
import { persistStore, persistReducer, PURGE } from 'redux-persist'
import storage from "redux-persist/lib/storage"
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

import productosReducer from './productosSlice'
import authReducer from './authSlice'
import categoriasReducer from './categoriasSlice'
import usuariosReducer from './usuariosSlice'
import { attachInterceptor } from './interceptor/axios' 
import pedidosReducer from "./pedidosSlice"
import cartSlice from "./cartSlice"

const persistConfig = {
    key: "auth",
    storage,
    stateReconciler: autoMergeLevel2
}

const authPersistedReducer = persistReducer(persistConfig, authReducer)

const store = configureStore({
    reducer: {
        productos: productosReducer,
        auth: authPersistedReducer,
        categorias: categoriasReducer,
        pedidos: pedidosReducer,
        usuarios: usuariosReducer,
        cart: cartSlice
    },
    //Ignorar warning de usar PURGE en authSlice
    //https://redux-toolkit.js.org/usage/usage-guide#working-with-non-serializable-data
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [PURGE],
      },
    }),
});

export const persistor = persistStore(store)

attachInterceptor(store);

export default store;