import { createSlice } from '@reduxjs/toolkit'
import {Backgrounds} from '../constant'

const initialState = {
    backgrounds : Backgrounds.WHITE,
    isDowload : false,
}

export const optionsSlice = createSlice({
    name: 'options',
    initialState,
    reducers: {
        setBackground: (state, action) => {
            state.backgrounds = action.payload
        },
        setIsDownload: (state, action) => {
            state.isDownload = action.payload
        }
       
    }
})

export const {setBackground ,setIsDownload,setIsReset} = optionsSlice.actions
export default optionsSlice.reducer
