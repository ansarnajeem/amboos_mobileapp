const initialState={
    device_token:'',
    loggedIn:false,
    logged_user:{}
}
export function cartItems(state = [], action) {
    switch (action.type) {
        case 'ADD_TO_CART':

            return [...state, action.payload];

        case 'DROP_ITEM_FROM_CART':
            const index = state.findIndex(cartItem => cartItem.product_id === action.payload.product_id);
            
            return state.filter((_, i) => i !== index);
        case 'REMOVE_FROM_CART':
            return state.filter(cartItem => cartItem.product_id !== action.payload.product_id)
    }

    return state
}

export function itemsHaveError(state = false, action) {
    switch (action.type) {
        case 'ITEMS_HAVE_ERROR':
            return action.hasError;

        default:
            return state;
    }
}

export function itemsAreLoading(state = false, action) {
    switch (action.type) {
        case 'ITEMS_ARE_LOADING':
            return action.isLoading;

        default:
            return state;
    }
}


export function items(state = false, action) {
    switch (action.type) {
        case 'ITEMS_FETCH_DATA_SUCCESS':
            return action.token;

        default:
            return state;
    }
}

export function profile_Data(state = [], action) {
    switch (action.type) {
        case 'GET_PROFILE_DETAILS':
            return action.payload;

        default:
            return state;
    }
}

export function order_Data(state = [], action) {
    switch (action.type) {
        case 'GET_ORDER_DETAILS':
            return action.payload;

        default:
            return state;
    }
}

export function transaction_Data(state = [], action) {
    switch (action.type) {
        case 'GET_TRANSACTION_DETAILS':
            return action.payload;

        default:
            return state;
    }
}
export function currentUser(state={logged_user:'arun'}, action) {
    switch (action.type) {
        case 'CURRENT_USER':
            return { ...state, logged_user:action.payload };

        default:
            return state;
    }
}

export function authUser(state=initialState,action){
    switch (action.type) {
        case 'GET_TOKEN':
            return state;
        case 'SAVE_TOKEN':
            return {...state,device_token: action.payload};
        case 'CURRENT_USER':
            return { ...state, logged_user:action.payload };
        case 'USER_LOGGED':
            return { ...state,loggedIn:action.payload };
        default:
            return state;
    }
}