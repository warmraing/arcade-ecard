"use strict";

import { isLocalStorageAvailable } from './unit.js';
import { ychSystem, getShopInfo, getCardInfoData } from './ychApi.js';

let apiSite;
const defaultApiSite = "http://127.0.0.1:8080";

let timer, clickEvent;
let localStorageAvailable = false;

let userToken, memberData;

function initCardData() {
    memberData = new ychSystem(userToken, apiSite);
    memberData.getCardStoredValue();

    clickEvent = document.getElementById("cardQRCode")
        .addEventListener("click", refreshQRCode, false);
    timer = setInterval(refreshQRCode, 15000);
}

async function refreshQRCode() {
    clearInterval(timer);
    memberData.refreshQRCode();
    memberData.getCardStoredValue();  
    timer = setInterval(refreshQRCode, 15000);
}

async function setCard(event) {
    event.preventDefault();
    const inputToken = document.getElementById("userInputToken").value;
    const inputCustomApiSite = document.getElementById("userCustomApiSite").value;

    apiSite = inputCustomApiSite == '' ? 
        defaultApiSite : inputCustomApiSite;
   
    try {
        const cardInfoObj = await getCardInfoData(inputToken, apiSite);
        userToken = inputToken;
        const userCardId = cardInfoObj.Data.CardNo;

        const ShopNameObj = await getShopInfo(userToken, apiSite);
        const shopName = ShopNameObj.Data.ShopName;

        document.getElementById("userCardId")
            .innerHTML = userCardId;
        document.getElementById("shopName")
            .innerHTML = shopName;

        if(localStorageAvailable) {
            localStorage.setItem("token", userToken);
            localStorage.setItem("cardId", userCardId);
            localStorage.setItem("shopName", shopName);

            if(inputCustomApiSite != '') localStorage.setItem("customApiSite", apiSite);
        }

        document.getElementById("cardSetArea").classList.add('hide');
        document.getElementById("QRcodeShowArea").classList.remove('hide');
        document.getElementById("cardMenuArea").classList.remove('hide');
        document.getElementById("cardShopArea").classList.remove('hide');
        initCardData();
    } catch {
        apiSite = defaultApiSite;
        alert("Token无效，需重新获取");
    }
}

export async function cleanCard() {
    if(localStorageAvailable) localStorage.clear();
    userToken = undefined;
    apiSite = defaultApiSite;

    document.getElementById("QRcodeShowArea").classList.add('hide');
    document.getElementById("cardMenuArea").classList.add('hide');
    document.getElementById("cardShopArea").classList.add('hide');
    document.getElementById("cardSetArea").classList.remove('hide');
    clearInterval(timer);
    removeEventListener("click", clickEvent, false);
}

//网页完成加载刷新数据
window.onload = (event) => {
    document.getElementById("cardSetForm")
        .addEventListener("submit", setCard, false);
    document.getElementById("cleanCardButton")
        .addEventListener("click", cleanCard, false);

    if( isLocalStorageAvailable() ) {
        localStorageAvailable = true;

        userToken = localStorage.getItem("token");

        document.getElementById("userCardId")
            .innerHTML = localStorage.getItem("cardId");
        document.getElementById("shopName")
            .innerHTML = localStorage.getItem("shopName");

        apiSite = localStorage.getItem("customApiSite") == null ? 
            defaultApiSite : localStorage.getItem("customApiSite");

        if (userToken != undefined) {
            document.getElementById("QRcodeShowArea").classList.remove('hide');
            document.getElementById("cardMenuArea").classList.remove('hide');
            document.getElementById("cardShopArea").classList.remove('hide');
            initCardData();
        } else {
            document.getElementById("cardSetArea").classList.remove('hide');
        }
    }

};