import { SET_HEADER_SCALES } from "./header.reducer.js";
import { SET_IS_FILTER_SHOWN } from "./header.reducer.js";
import { store } from "./store.js";

export function setHeaderScales(scales){
    store.dispatch({type:SET_HEADER_SCALES, scales})
}

export function setIsFilterShown(isFilterShown){
    store.dispatch({type:SET_IS_FILTER_SHOWN, isFilterShown})
}