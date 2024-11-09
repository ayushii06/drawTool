import { configureStore } from '@reduxjs/toolkit';
import  menuSlice  from './slice/menuSlice';
import toolbarSlice  from './slice/toolbarSlice';
import  optionsSlice  from './slice/optionsSlice';

export const store = configureStore({
    reducer: {
        menu: menuSlice,
        toolbar: toolbarSlice,
        options: optionsSlice,
    }
});
