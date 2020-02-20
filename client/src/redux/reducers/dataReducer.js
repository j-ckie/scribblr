import { SET_SCRIBBLES, LIKE_SCRIBBLE, UNLIKE_SCRIBBLE, LOADING_DATA, DELETE_SCRIBBLE } from "../types";

const initialState = {
    scribbles: [],
    scribble: {},
    loading: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case LOADING_DATA:
            return {
                ...state,
                loading: true
            }
        case SET_SCRIBBLES:
            return {
                ...state,
                scribbles: action.payload,
                loading: false
            };
        case LIKE_SCRIBBLE:
            // case UNLIKE_SCRIBBLE:
            let index = state.scribbles.findIndex((scribble) => scribble.scribbleId === action.payload.scribbleId);

            state.scribbles[index] = action.payload;

            return {
                ...state,
                scribble: action.payload, // delete this if it doesn/t work
                loading: false //same here
            }
        case DELETE_SCRIBBLE:
            let delIndex = state.scribbles.findIndex(scribble => scribble.scribbleId === action.payload)
            state.scribbles.splice(delIndex, 1);
            return {
                ...state
            }
        default:
            return state;
    }
}