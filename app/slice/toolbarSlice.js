import { createSlice } from '@reduxjs/toolkit';
import { tools } from '../constant';

const initialState = {
    tool : tools.Pen
}

export const toolbarSlice = createSlice({
    name : 'toolbar',
    initialState,
    reducers : {
        setTool : (state, action) => {
            state.tool = action.payload;
        },
    }

})

export const {setTool} = toolbarSlice.actions;
export default toolbarSlice.reducer;