import { SET_USER, SET_ERRORS, CLEAR_ERRORS, LOADING_UI, SET_AUTHENTICATED, SET_UNAUTHENTICATED, LOADING_USER, LIKE_SCRIBBLE, UNLIKE_SCRIBBLE } from "../types";

const initialState = {
    authenticated: false,
    loading: false,
    credentials: {},
    likes: [],
    notifications: []
}

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_AUTHENTICATED:
            return {
                ...state,
                authenticated: true
            }
        case SET_UNAUTHENTICATED:
            return initialState;
        case SET_USER:
            return {
                authenticated: true,
                loading: false,
                ...action.payload
            };
        case LOADING_USER:
            return {
                ...state,
                loading: true
            }
        case LIKE_SCRIBBLE:
            return {
                ...state,
                likes: [
                    ...state.likes,
                    {
                        userHandle: state.credentials.handle,
                        scribbleId: action.payload.scribbleId
                    }
                ]
            };
        case UNLIKE_SCRIBBLE:
            return {
                ...state,
                likes: state.likes.filter(
                    like => like.scribbleId !== action.payload.scribbleId
                )
            }
        default:
            return state;
    }
}
