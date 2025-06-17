"use strict";

import { cleanCard } from "./index.js";

// 油菜花系统api
async function getRequest(token, url) {
    const response = await fetch(url, {
        credentials: 'include',
        keepalive: true,
        method: 'GET',
        headers: {
            'Authorization': token,
        }
    });

    return response.json();
}

function fetchGetRequest(token, url) {
    return fetch(url, {
        credentials: 'include',
        keepalive: true,
        method: 'GET',
        headers: {
            'Authorization': token,
        }
    });
}

export class ychSystem {
    qrcode; token; apiSite;
    constructor (token, apiSite){
        this.token = token;
        this.apiSite = apiSite;
        const response = fetchGetRequest(this.token, this.apiSite + '/gzych/GetLeaguerDynamicQRCode');

        response.then((response) => {
            if(!response.ok) {
                throw new Error("Token无效");
            }
            return response.json();
        }).then((QRCodeObj) => {
            this.qrcode = new QRCode(document.getElementById("cardQRCode"), {
                text: QRCodeObj.Data.QRCode,
                width: 150,
                height: 150,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.M,
                drawer: 'svg'
            });
        }).catch((error) => {
            alert("Token无效，需重新获取");
            cleanCard();
        });
    };

    getCardStoredValue() {
        const response = fetchGetRequest(this.token, this.apiSite + '/gzych/GetMemberStoredValue');

        response.then((response) => {
            if(!response.ok) {
                throw new Error("Token无效");
            }
            return response.json();
        }).then((CardStoredObj) => {
            document.getElementById("coin").innerHTML = Number(CardStoredObj.Data.LeaguerValues[1].BalanceNum);
            document.getElementById("goldCoin").innerHTML = Number(CardStoredObj.Data.LeaguerValues[2].BalanceNum);
        })
    };

    refreshQRCode() {
        const response = fetchGetRequest(this.token, this.apiSite + '/gzych/GetLeaguerDynamicQRCode');
        response.then((response) => {
            if(!response.ok) {
                throw new Error("Token无效");
            }
            return response.json();
        }).then((QRCodeObj) => {
            this.qrcode.makeCode(QRCodeObj.Data.QRCode);
        })
    }
}

export async function getCardInfoData(token, apiSite) {
    return getRequest(token, apiSite + '/gzych/BasicInfo');
};

export async function getShopInfo(token, apiSite) {
    return getRequest(token, apiSite + '/gzych/GetShopInfo');
};