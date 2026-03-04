import { configureStore, combineReducers } from '@reduxjs/toolkit'
import userReducer  from './user/userSlice.js'
import { persistReducer, persistStore, createTransform } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const rootReducer = combineReducers({user: userReducer})

const resetTransientState = createTransform(
    (inboundState) => ({ ...inboundState, loading: false, error: null }),
    (outboundState) => ({ ...outboundState, loading: false, error: null }),
    { whitelist: ['user'] }
)

const persistConfig = {
    key:'root',
    storage,
    version: 1,
    transforms: [resetTransientState],
}

const persistedReducer = persistReducer(persistConfig,rootReducer)
const store = configureStore({
  reducer:  persistedReducer,
  middleware:(getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }),
})

export default store;
export const persistor = persistStore(store)