import { createSlice } from '@reduxjs/toolkit'
import { tools, colors} from '../constant'

const initialState = {
    [tools.Pen]: {
        color: colors.BLACK,
        size: 9,
        thinning: 0.73,
        smoothing: 0.43,
        streamline: 0.53,
    },
    [tools.Eraser]: {
        color: colors.WHITE,
        size: 3
    },
    [tools.Line]: {
        color: colors.BLACK,
        size: 3,
        style: 'solid'
    },
    [tools.Rectangle]: {
        color: colors.BLACK,
        size: 3,
        fill : 'white',
        fillStyle: 'solid',
        style: 'solid'

    },
    [tools.Circle]: {
        color: colors.BLACK,
        size: 3,
        fill : 'white',
        fillStyle: 'solid',
        style: 'solid'
    },
    [tools.Text]: {
        color: colors.BLACK,
        size: 24
    }
}

export const menuSlice = createSlice({
    name: 'toolbox',
    initialState,
    reducers: {
        setColor: (state, action) => {
            state[action.payload.item].color = action.payload.color
        },
        setSize: (state, action) => {
            state[action.payload.item].size = action.payload.size
        },
        setThinning: (state, action) => {
            state[tools.Pen].thinning = action.payload.thinning
        },
        setSmoothing: (state, action) => {
            state[tools.Pen].smoothing = action.payload.smoothing
        },
        setStreamline: (state, action) => {
            state[tools.Pen].streamline = action.payload.stream
        },
        setFill: (state, action) => {
            state[action.payload.item].fill = action.payload.fill
        },
        setStyle : (state, action) => {
            state[action.payload.item].style = action.payload.fill
        },
        setFillStyle : (state, action) => {
            state[action.payload.item].fillStyle = action.payload.fill
        },
    }
})

export const { setColor, setSize , setSmoothing,setThinning,setStreamline , setFill,setStyle,setFillStyle} = menuSlice.actions
export default menuSlice.reducer
