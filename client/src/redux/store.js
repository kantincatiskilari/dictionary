import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from './userSlice';
import pageReducer from './pageSlice';
import postReducer from './postSlice';
import topicReducer from './topicSlice';
import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
  } from 'redux-persist';
import storage from 'redux-persist/lib/storage';


const persistConfig = {
    key: 'root',
    version: 1,
    storage,
};

const rootReducer = combineReducers({user: userReducer, page: pageReducer, post: postReducer, topic: topicReducer})

const persistedReducer = persistReducer(persistConfig,rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});