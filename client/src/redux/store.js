import { configureStore,combineReducers } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import {persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import persistStore from 'redux-persist/es/persistStore';


//if we have more than one reducers we need to combine them using combineReducers


const rootReducer = combineReducers({

  user:userReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  version:1,
};


const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck:false}),
});
//middleware is for checking the serializability of the state and action and we are turning it off because we are using redux-persist also it checks for errors in the state and action

export const persistor = persistStore(store);