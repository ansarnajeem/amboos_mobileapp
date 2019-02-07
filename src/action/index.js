import React, {
    Component
} from 'react';
import {
    AsyncStorage
} from "react-native"

import deviceStorage from '../services/deviceStorage';
let formdata = new FormData();
formdata.append("username", "mobileApp");
formdata.append("key", "IFu3tSrg7QVawbbOyCV1E1a3pZe3j1UnCYnGlr4iSgtvDX5smqK72xUTstCMy20JuWZNnd5qws2gyswjcM1UFwmZVeGZLp1XgfPcvTrllu3SQugVWJKlmUxQrFYNBGLMDaBL34lS5yiHwZIgnCTugBichPfUnGbS1HVPOSs2u51EQArAOYyAg06RduVubpgLYF8G16j6D0foYk8rIcfCmWP6WdTlQ38eAyLY3fxTE4BvqsirFUbWprBySx2qEu0r");


export function getData(type, data) {
    return {
        type: type,
        payload: data
    };
}



export function FetchData(token, type) {
    return (dispatch) => {
        let url = "";
        if (type == "GET_PROFILE_DETAILS") {
            url = "http://techfactories.com/test2/index.php?route=api/account&api_token=";
        }
        if (type == "GET_ORDER_DETAILS") {
            url = "http://techfactories.com/test2/index.php?route=api/account/customerOrder&api_token=";
        }
        if (type == "GET_TRANSACTION_DETAILS") {
            url = "http://techfactories.com/test2/index.php?route=api/transactions&api_token=";
        }
        fetch(url + token)
            .then((response) => response.json())
            .then((responseJson) => {
                dispatch(getData(type, responseJson.data));
            })
            .catch((error) => {
                console.error(error);
                //dispatch(itemsHaveError(true))
            });
    }
}





export function cartItems(cartitem, type) {
    return {
        type: type,
        payload: cartitem
    };
}
export function dropItems(product_id, type) {
    return {
        type: type,
        payload: product_id
    };
}
export function removeItems(product_id, type) {
    return {
        type: type,
        payload: product_id
    };
}

export function itemsHaveError(bool) {
    return {
        type: 'ITEMS_HAVE_ERROR',
        hasError: bool
    };
}
export function itemsAreLoading(bool) {
    return {
        type: 'ITEMS_ARE_LOADING',
        isLoading: bool
    };
}

export function itemsFetchDataSuccess(item) {
    return {
        type: 'ITEMS_FETCH_DATA_SUCCESS',
        token: item
    };
}

_storeData = async (token) => {
    try {
        await AsyncStorage.setItem('session_token', token);
    } catch (error) {
        // Error saving data
    }
}
export function  saveUserAccess(){
    return (dispatch) => {
        fetch('http://techfactories.com/test2/index.php?route=api/login', {
                method: 'post',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formdata
            })
            .then((response) => response.json())
            .then((responseJson) => {
               
                dispatch(saveUserToken(responseJson.api_token));
            })
            .catch((error) => {
                console.error(error);
                //dispatch(itemsHaveError(true))
            });
    };
}

export function itemsFetchData() {
    return (dispatch) => {
        fetch('http://techfactories.com/test2/index.php?route=api/login', {
                method: 'post',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formdata
            })
            .then((response) => response.json())
            .then((responseJson) => {
                deviceStorage.saveKey("id_token", responseJson.api_token);
                _storeData(responseJson.api_token).then(() => {
                    dispatch(itemsFetchDataSuccess(responseJson));
                    // dispatch(saveUserToken(responseJson.api_token));
                });
            })
            .catch((error) => {
                console.error(error);
                //dispatch(itemsHaveError(true))
            });
    };
}
export function currentLoggedUser(){
    // let current_user=deviceStorage.loggedUser();
    let current_user='sumesh';
    return (dispatch) => {
        dispatch( getData('CURRENT_USER',current_user));
    }
    
}

export function getUserToken() {
    return {
        type: 'GET_TOKEN',
       
        
    };
}
export function saveUserToken(token) {
    return {
        type: 'SAVE_TOKEN',
        payload:token
    };
}
export function saveCurrentUser(data) {
    return {
        type: 'CURRENT_USER',
        payload:data
    };
}





