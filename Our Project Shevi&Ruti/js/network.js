function sendTheRequest(details, type, url, async, myThis) {

    if (async === true) {
        window.setTimeout(() => {
            restApi(details, type, url, myThis);
            toOnloadTheResponse(myThis);

        },0);
    }
    if (async === false) {
        restApi(details, type, url, myThis);
        toOnloadTheResponse(myThis);
    }
    
}

function toOnloadTheResponse(myThis) {
    myThis.onload();
}


