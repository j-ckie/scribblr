import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
// ======= Reducers =======
import userReducer from "./reducers/userReducer";
import dataReducer from "./reducers/dataReducer";
import uiReducer from "./reducers/uiReducer";
const initialState = {};
const middleware = [thunk];
// combine all reducers (works kinda like express routes, but for reducers)
const reducers = combineReducers({
    user: userReducer,
    data: dataReducer,
    UI: uiReducer
});
const store = createStore(reducers, initialState, compose(applyMiddleware(...middleware), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()))
export default store;