function restApi(details, type, url, myThis) {
    let arr = url.split('/');
    let titleOrId = '';
    let whereToSearch = '';
    let numForPaging = 0;

    if (arr[4] != '') {
        whereToSearch = arr[4];
    }
    else {
        myThis.status = 100;
        return;
    }
    numForPaging = arr[arr.length - 1];
    if (arr[5] != '') {
        let newarr = arr[5].split('?');
        if (newarr.length > 1) {
            let finalArr = newarr[1].split('=');
            if (finalArr[0] === "title"||finalArr[0] === "id") {
                console.log(titleOrId);
                titleOrId = finalArr[1];
            }
        }
    }

    if (arr[3] === "api") {

        switch (type) {
            case 'GET':
                {
                    response = toGet(titleOrId,details, whereToSearch, numForPaging);
                    break;
                }
            case 'POST':
                {
                    response = toPost(details, whereToSearch);
                    break;
                }
            case 'PUT':
                {
                    response = toPut( details);
                    break;
                }
            case 'DELETE':
                {
                    response = toDelete(titleOrId, numForPaging);
                    break;
                }
        }
    }
    else {
        myThis.status = 100;
        return;
    }
    myThis.status = response[0];
    myThis.responseText = response[1];
    myThis.responseHeaders[0] = response[2];
    myThis.responseHeaders[1] = response[3];
    myThis.responseHeaders[2] = response[4];
    return;
}
