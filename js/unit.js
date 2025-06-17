"use strict";

export function isLocalStorageAvailable(){
    try {
        localStorage.setItem("test", 'test');
        localStorage.removeItem("test");
        return true;
    } catch(e) {
        return false;
    }
}