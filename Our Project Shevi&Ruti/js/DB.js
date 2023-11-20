class User {
    constructor() {
        this.name = '';
        this.mail = ' ';
        this.password = '';
        this.tasks = [];
    }
}

let userNow = new User;
let flagIfPersonConect;
let perNow;
let nameNow;
let myStatus;
let k = 1;

function singUp(details) {
    let user = new User();
    let currentUser = new User();
    flagIfPersonConect = true;
    user.name = details.name;
    user.mail = details.mail;
    user.password = details.password;
    for (let i = 0; i < localStorage.length; i++) {
        nameNow = localStorage.key(i);
        currentUser = JSON.parse(localStorage.getItem(nameNow))
        if (currentUser.mail === user.mail || currentUser.password === user.password) {
            flagIfPersonConect = false;
        }
    }
    if (flagIfPersonConect) {
        userNow = user;
        localStorage.setItem(user.name, JSON.stringify(user))
        myStatus = 200;
        let arrey = [myStatus, details];
        return arrey;

    }
    myStatus = 404;
    return ([myStatus, details]);
}

function logIn(details) {
    let user = new User();
    let currentUser = new User();
    flagIfPersonConect = false;
    user.name = details.name;
    user.password = details.password;
    for (let i = 0; i < localStorage.length; i++) {
        nameNow = localStorage.key(i);
        currentUser = JSON.parse(localStorage.getItem(nameNow));
        if (user.name === currentUser.name) {
            if (user.password === currentUser.password) {
                userNow = currentUser;
                flagIfPersonConect = true;
                localStorage.setItem(user.name, JSON.stringify(currentUser))
                myStatus = 200;
                let arrey = [myStatus, details];
                return arrey;
            }
        }
    }
    myStatus = 404;
    return [myStatus, details];
}

function toGet(titleOrId, details, whereToSearch, numForPaging) {
    if (whereToSearch === 'logIn') {
        return logIn(details);
    }
    else if (whereToSearch === 'tasks') {
        for (let i = 0; i < localStorage.length; i++) {
            if (userNow.name === localStorage.key(i)) {
                userNow.name = localStorage.key(i);
                let currentUser = JSON.parse(localStorage.getItem(userNow.name));
                if (currentUser.mail === userNow.mail) {
                    if (titleOrId === '') {
                        return ifINeedToGetAll(currentUser,numForPaging);
                    }
                    else {
                        return ifINeedToGetPart(currentUser,titleOrId);
                    }
                }
            }
        }
    }
    myStatus = 404;
    return ([myStatus, details]);
}

function toPost(details, whereToSearc) {
    if (whereToSearc === 'signUp') {
        return singUp(details);
    }
    else if (whereToSearc === 'tasks'){
        for (let i = 0; i < localStorage.length; i++) {
            if (userNow.name === localStorage.key(i)) {
                let currentUser = JSON.parse(localStorage.getItem(userNow.name));
                if (currentUser.mail === userNow.mail) {
                    details.idOfTask = "numOfId" + `${k}`;
                    k++;
                    currentUser.tasks.splice(0, 0, details);
                    localStorage.setItem(userNow.name, JSON.stringify(currentUser));
                    let ifIcanMoveToTheNextPage = false;
                    if (currentUser.tasks.length > 6) {
                        ifIcanMoveToTheNextPage = true;
                    }
                    myStatus == 200;
                    let lastTask;
                    if (currentUser.tasks[6] != null) {
                        lastTask = currentUser.tasks[6];
                    }
                    else {
                        lastTask = -1;
                    }
                    return ([myStatus, details, ifIcanMoveToTheNextPage, lastTask]);
                }
            }
        }
        myStatus == 404;
        return ([myStatus, details]);
    }
}

function toPut( details) {
    for (let i = 0; i < localStorage.length; i++) {
        if (userNow.name === localStorage.key(i)) {
            userNow.name = localStorage.key(i)
            let currentUser = JSON.parse(localStorage.getItem(userNow.name));
            if (currentUser.mail === userNow.mail) {
                for (let i = 0; i < currentUser.tasks.length; i++) {
                    if (currentUser.tasks[i].idOfTask === details.idOfTask) {
                        if (details.titleOfTask != '') {
                            currentUser.tasks[i].titleOfTask = details.titleOfTask;
                        }
                        currentUser.tasks[i].typeOfTask = details.typeOfTask;
                        details = currentUser.tasks[i];
                        break;
                    }
                }
                localStorage.setItem(userNow.name, JSON.stringify(currentUser))
                myStatus == 200;
                return ([myStatus, details]);
            }
        }
    }
    myStatus == 404;
    return ([myStatus, details]);
}

function toDelete(titleOrId, numForPaging) {
    let details;
    for (let i = 0; i < localStorage.length; i++) {
        if (userNow.name === localStorage.key(i)) {
            userNow.name = localStorage.key(i)
            let currentUser = JSON.parse(localStorage.getItem(userNow.name));
            if (currentUser.mail === userNow.mail) {
                for (let i = 0; i < currentUser.tasks.length; i++) {
                    if (currentUser.tasks[i].idOfTask === titleOrId) {
                        details = currentUser.tasks[i];
                        currentUser.tasks.splice(i, 1);
                        break;
                    }
                }
                return whatHapInPaggingAfterDelete(numForPaging, currentUser,details);
            }
        }
    }
    myStatus == 404;
    return ([myStatus, 0]);
}

function whatHapInPaggingAfterDelete(numForPaging, currentUser,details) {
    if (numForPaging * 6 > currentUser.tasks.length) {
        return [404, 0];
    }
    let whoToAdd = numForPaging * 6 + 5;
    let taskToAddToThisPage;
    if (currentUser.tasks[whoToAdd] != undefined) {
        taskToAddToThisPage = currentUser.tasks[whoToAdd];
    }
    else {
        taskToAddToThisPage = -1;
    }
    let ifIcanMoveToTheNextPage = false;
    if (currentUser.tasks.length > numForPaging * 6 + 6) {
        ifIcanMoveToTheNextPage = true;
    }
    let loadTheBackPage = false;
    if (currentUser.tasks.length <= numForPaging * 6 && currentUser.tasks.length != 0) {
        loadTheBackPage = true;
    }
    myStatus == 200;
    localStorage.setItem(userNow.name, JSON.stringify(currentUser));
    return ([myStatus, details, ifIcanMoveToTheNextPage, taskToAddToThisPage, loadTheBackPage]);
}

function ifINeedToGetAll(currentUser,numForPaging) {
    let arrOfDetails = [];
    let fromWhichTaskToStart = numForPaging * 6;
    if (fromWhichTaskToStart > currentUser.tasks.length - 1 && fromWhichTaskToStart != 0) {
        return [404, 0];
    }
    for (let i = 0; fromWhichTaskToStart < currentUser.tasks.length && i < 6; i++, fromWhichTaskToStart++) {
        arrOfDetails[i] = currentUser.tasks[fromWhichTaskToStart];
    }
    let ifIcanMoveToTheNextPage = false;
    if (fromWhichTaskToStart < currentUser.tasks.length) {
        ifIcanMoveToTheNextPage = true;
    }
    myStatus == 200;
    return ([myStatus, arrOfDetails, ifIcanMoveToTheNextPage]);
}

function ifINeedToGetPart(currentUser,titleOrId) {
    let details = [];
    let j = 0;
    for (let i = 0; i < currentUser.tasks.length; i++) {
        if (currentUser.tasks[i].titleOfTask.includes(titleOrId)) {
            details[j] = currentUser.tasks[i];
            j++;
            myStatus = 200;
        }
    }
    details[j] = 0;
    return ([myStatus, details]);
}