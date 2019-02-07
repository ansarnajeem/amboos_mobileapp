import { combineReducers } from 'redux';
import { cartItems, items, itemsHaveError, itemsAreLoading , profile_Data, order_Data,transaction_Data,currentUser,authUser} from './cartItems.js';

export default combineReducers({
    cartItems,
    items,
    itemsHaveError,
    itemsAreLoading,
    profile_Data,
    order_Data,
    transaction_Data,
    currentUser,
    authUser
});