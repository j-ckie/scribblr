import { SET_SCRIBBLES, LIKE_SCRIBBLE, LOADING_DATA, DELETE_SCRIBBLE, POST_SCRIBBLE, SET_SCRIBBLE, SUBMIT_COMMENT } from "../types"; //UNLIKE_SCRIBBLE,

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
        case SET_SCRIBBLE:
            return {
                ...state,
                scribble: action.payload
            }
        case LIKE_SCRIBBLE:
            // case UNLIKE_SCRIBBLE:
            let index = state.scribbles.findIndex((scribble) => scribble.scribbleId === action.payload.scribbleId);

            state.scribbles[index] = action.payload;
            if (state.scribble.scribbleId === action.payload.scribbleId) {
                state.scribble = action.payload
            }
            return {
                ...state,
                scribble: action.payload,
                loading: false
            }
        case DELETE_SCRIBBLE:
            let delIndex = state.scribbles.findIndex(scribble => scribble.scribbleId === action.payload)
            state.scribbles.splice(delIndex, 1);
            return {
                ...state
            }
        case POST_SCRIBBLE:
            return {
                ...state,
                scribbles: [
                    action.payload,
                    ...state.scribbles
                ]
            }
        case SUBMIT_COMMENT:
            return {
                ...state,
                scribble: {
                    ...state.scribble,
                    comments: [action.payload, ...state.scribble.comments]
                }
            }
        default:
            return state;
    }
}