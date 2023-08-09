export const SET_HEADER_SCALES = 'SET_HEADER_CSALES'
export const SET_IS_FILTER_SHOWN = 'SET_IS_FILTER_SHOWN'
export const SET_IS_FILTER_MODAL_SHOWN = 'SET_IS_FILTER_MODAL_SHOWN'

const initialState = {
    scales: {
    height : 'low',
    width :'wide' ,
    },
    isFilterShown: false,
    isFilterModalShown: false
}

export function headerReducer(state = initialState, action) {
    var newState = state
    
    switch (action.type) {
        case SET_HEADER_SCALES:
            newState = { ...state, scales: action.scales }
            break
        case SET_IS_FILTER_SHOWN:
            newState = { ...state, isFilterShown: action.isFilterShown }
            break  
        case SET_IS_FILTER_MODAL_SHOWN:
            newState = { ...state, isFilterModalShown: action.isFilterModalShown }
            break     
        default:
            return state
    }
    return newState
}
            