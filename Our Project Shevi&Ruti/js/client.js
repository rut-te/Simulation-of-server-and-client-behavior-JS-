let thePageNow;
let main = document.querySelector("main");
showContent(1);//פתיחת העמוד
history.pushState({}, "login", `#login`);
//פונקציה להיסטוריה
window.addEventListener("popstate", () => {
    let currentPage = location.hash.replace("#", '');
    console.log(currentPage);
    switch (currentPage) {
        case "login":
            showContent(1);
            break;
        case "signUp":
            showContent(0);
            break;
        case "home":
            showContent(2);
            break;
    }
});
//בדיקה איזה עמוד נטען,ולמה צריך לעשות ארוע
function checkWhichPageOnloadNow(thePageNow) {
    if (thePageNow == 0) {
        addevevntsignup();
        let login = document.getElementById("logIn");
        login.addEventListener('click', () => {
            history.pushState({}, "login", `#login`);
            showContent(1);
        });
    }
    if (thePageNow == 1) {
        addeventlogin();
        let signUp = document.getElementById("signup");
        signUp.addEventListener('click', () => {
            history.pushState({}, "signUp", `#signUp`);
            showContent(0);
        });
    }
    if (thePageNow == 2) {
        addEventHomePage();
        let logOut = document.getElementById("logOut");
        logOut.addEventListener('click', () => {
            history.pushState({}, "login", `#login`);
            showContent(1);
        });
    }
}
//הצגת העמוד הרצוי
function showContent(i) {//פונקציה שטוענת את הדף המבוקש
    let myTemplete = document.getElementsByTagName("template")[i];
    let clon = myTemplete.content.cloneNode(true);
    main.innerHTML = " ";
    main.append(clon);
    thePageNow = i;
    checkWhichPageOnloadNow(thePageNow);
}
//עמוד הרשמה
function addevevntsignup() {
    let sendSignUp = document.querySelector("#sendFromSignup");//יבוא sign up
    sendSignUp.addEventListener('click', sendToSignUp);//sign up יצירת ארוע הקורא לפונקציה לבדיקת 
    function sendToSignUp() {
        let details = {
            name: '',
            mail: '',
            password: 0
        }
        details.name = document.getElementById("nameOfSignUp").value;//יבוא שם המשתמש
        details.mail = document.getElementById("mailOfSignUp").value;//יבוא מייל המשתמש
        details.password = document.getElementById("passwordOfSignUp").value//יבוא קוד המשתמש
        if (details.mail === "" || details.name === "" || details.password === "")//אם המשתמש לא הכניס פרטים
        {
            alert("הכנס פרטים");
        }
        else {

            const fxhr = new FXMLHttpRequest();
            fxhr.open('POST', 'https://my-task.co.il/api/signUp/');
            fxhr.onload = function () {
                if (fxhr.status > 199 && fxhr.status < 300) {
                    history.pushState({}, "home", `#home`);
                    showContent(2);
                }
                else{
                    alertInErrorStatus(fxhr);
                }
            }
            fxhr.send(details);

        }
    }
}
//עמוד התחברות
function addeventlogin() {
    let formOfLogin = document.querySelector("#sendFromLogin");//יבוא login
    formOfLogin.addEventListener('click', sendToLogIn);//login יצירת ארוע הקורא לפונקציה לבדיקת 
    function sendToLogIn() {
        let details = {
            name: '',
            password: 0
        }
        details.name = document.getElementById("nameOfLogin").value;//יבוא שם המשתמש
        details.password = document.getElementById("passwordOfLogin").value;//יבוא הסיסמה
        if (details.name === "" || details.password === "")//במקרה שהמשתמש לא הכניס פרטים
        {
            alert("הכנס פרטים");
            return;
        }
            const fxhr = new FXMLHttpRequest();
            fxhr.open('GET', 'https://my-task.co.il/api/logIn/');
            fxhr.onload = function () {
                if (fxhr.status > 199 && fxhr.status < 300) {
                    history.pushState({}, "home", `#home`);
                    showContent(2);
                }
                else {
                    alertInErrorStatus(fxhr);
                }    
        }
        fxhr.send(details);
    }
}
//עמוד הבית
function addEventHomePage() {
    let addTask = document.getElementById("addTask");
    let tasksDiv = document.getElementById("tasks");
    let sendToSearch = document.getElementById("sendToSearch");
    let newDivToNewTask = document.getElementById("newDivToNewTask");
    let toAppendTheNewTask = document.getElementById("toAppendTheNewTask");
    let buttonToBackPage = document.getElementById("buttonToBackPageNotActive");
    let buttonToNextPage = document.getElementById("buttonToNextPageNotActive");
    let inMiddeleOfSearch = false;
    let numForPaging = 0;
    let j = 0;

    function addRequestOfPut(details) {
        const fxhr = new FXMLHttpRequest();
        fxhr.open('PUT', 'https://my-task.co.il/api/tasks/');
        fxhr.onload = function () {
            if (fxhr.status > 199 && fxhr.status < 300) {
                let divFornewTask = document.getElementById(fxhr.responseText.idOfTask);
                let idOfTitleTask = divFornewTask.dataTarget;
                let titleOfTask = document.getElementById(idOfTitleTask);
                titleOfTask.textContent = fxhr.responseText.titleOfTask;
                let colorByType = divFornewTask.querySelector('p');
                if (fxhr.responseText.typeOfTask === "🔴מטלה דחופה") {
                    colorByType.innerHTML = '🔴';
                }
                if (fxhr.responseText.typeOfTask === '🟡מטלה חשובה') {
                    colorByType.innerHTML = '🟡';
                }
                if (fxhr.responseText.typeOfTask === '🟢מטלה רגילה') {
                    colorByType.innerHTML = '🟢';
                }
            }
            else {
                alertInErrorStatus(fxhr);
            }
        }
        fxhr.send(details);

    }

    function addRequestOfPost(details) {
        const fxhr = new FXMLHttpRequest();
        fxhr.open('POST', 'https://my-task.co.il/api/tasks/');
        fxhr.onload = function () {
            if (fxhr.status > 199 && fxhr.status < 300) {
                if (numForPaging === 0 && inMiddeleOfSearch === false) {
                    addNewTask(fxhr.responseText);
                    if (fxhr.responseHeaders[1] != -1) {
                        let taskToDelete = document.getElementById(fxhr.responseHeaders[1].idOfTask);
                        taskToDelete.remove();
                    }
                    ifICanMoveBackOrNextPage(fxhr);
                }
                let messege = document.createElement('p');
                messege.innerHTML = "המטלה נוספה בהצלחה";
                messegeAboatSucceedRequest(messege);
            }
            else {
                alertInErrorStatus(fxhr);
            }

        }
        fxhr.send(details);
    }

    function addRequestOfDelete(idOfTaskDiv) {
        const fxhr = new FXMLHttpRequest();
        fxhr.open('DELETE', 'https://my-task.co.il/api/tasks/?id=' + `${idOfTaskDiv}` + "/" + `${numForPaging}`);
        fxhr.onload = () => {
            if (fxhr.status > 199 && fxhr.status < 300) {
                let divFornewTask = document.getElementById(fxhr.responseText.idOfTask);
                divFornewTask.remove();
                let messege = document.createElement('p');
                messege.innerHTML = "המטלה נמחקה בהצלחה";
                messegeAboatSucceedRequest(messege);
                if (fxhr.responseHeaders[1] != -1) {
                    addNewTask(fxhr.responseHeaders[1], 'DELETE');
                }
                ifICanMoveBackOrNextPage(fxhr);
                if (fxhr.responseHeaders[2] === true) {
                    numForPaging--;
                    addRequestOfGetAll();
                }
            }
            else {
                alertInErrorStatus(fxhr);
            }

        }
        fxhr.send();
    }

    function addRequestOfGet(titleToSearch) {
        const fxhr = new FXMLHttpRequest();
        fxhr.open('GET', 'https://my-task.co.il/api/tasks/?title=' + `${titleToSearch}` + '/0');//
        fxhr.onload = function () {
            if (fxhr.status > 199 && fxhr.status < 300) {
                numForPaging = 0;
                tasksDiv.innerHTML = '';
                if (fxhr.responseText.length > 1) {
                    for (let i = 0; i < fxhr.responseText.length; i++) {
                        if (fxhr.responseText[i] != 0) {
                            addNewTask(fxhr.responseText[i], 'search');
                            buttonToNextPage.id = "buttonToNextPageNotActive";
                            buttonToBackPage.id = "buttonToBackPageNotActive";
                            if (titleToSearch === '') {
                                ifICanMoveBackOrNextPage(fxhr);
                            }
                        }
                    }
                }
                else {
                    alert("לא נמצאו תוצאות");
                }
            }
            else {
                alertInErrorStatus(fxhr);
            }

        }
        fxhr.send();
    }

    function addRequestOfGetAll() {
        buttonToNextPage.id = "buttonToNextPageNotActive";
        buttonToBackPage.id = "buttonToBackPageNotActive";
        const fxhr = new FXMLHttpRequest();
        fxhr.open('GET', 'https://my-task.co.il/api/tasks/' + `${numForPaging}`);
        fxhr.onload = function () {
            if (fxhr.status > 199 && fxhr.status < 300) {
                tasksDiv.innerHTML = '';
                for (let i = fxhr.responseText.length - 1; i >= 0; i--) {
                    addNewTask(fxhr.responseText[i]);
                }
                ifICanMoveBackOrNextPage(fxhr);
            }
            else {
                alertInErrorStatus(fxhr);
            }

        }
        fxhr.send();
    }
   
    //בדיקה האם להפעיל את החיצים קדימה ואחורה
    function ifICanMoveBackOrNextPage(fxhr) {
        if (fxhr.responseHeaders[0] === true) {
            buttonToNextPage.id = "buttonToNextPageActive";
        }
        if (fxhr.responseHeaders[0] === false) {
            buttonToNextPage.id = "buttonToNextPageNotActive";
        }
        if (numForPaging > 0) {
            buttonToBackPage.id = 'buttonToBackPageActive';
        }
        else {
            buttonToBackPage.id = 'buttonToBackPageNotActive';
        }
    }
    //ארוע בכפתור אחורה
    buttonToBackPage.addEventListener("click", () => {
        if (numForPaging > 0) {
            numForPaging = numForPaging - 1;
            if (numForPaging > 0) {
                buttonToBackPage.id = 'buttonToBackPageActive';
            }
            if (numForPaging === 0) {
                buttonToBackPage.id = 'buttonToBackPageNotActive';
            }
        }
        addRequestOfGetAll();
    })
    //ארוע בכפתור קדימה
    buttonToNextPage.addEventListener("click", () => {
        numForPaging = numForPaging + 1;
        if (numForPaging > 0) {
            buttonToBackPage.id = 'buttonToBackPageActive';
        }
        addRequestOfGetAll();
    })
    //טעינת המטלות
    addRequestOfGetAll();

    addTask.addEventListener('click', () => {
        let messegeToNew = document.createElement('p');
        messegeToNew.className = 'messege';
        messegeToNew.textContent = "מלא את פרטי המשימה החדשה";
        windowToNewTaskDetails(messegeToNew, 'POST');
    })
    //חיפוש
    sendToSearch.addEventListener('click', () => {
        let titleToSearch = document.getElementById("whatToSearch").value;
        if (titleToSearch === '')
            inMiddeleOfSearch = false;
        else
            inMiddeleOfSearch = true;
        addRequestOfGet(titleToSearch);

    })
    //הוספת מטלה חדשה
    function addNewTask(details, type) {
        let newTask = document.createElement("div");
        let idOfTaskDiv=details.idOfTask;
        newTask.id = idOfTaskDiv;
        let titleOfTask = document.createElement("div");
        let toDelete = document.createElement("button");
        let toPut = document.createElement("button");
        toDelete.textContent = '🗑';
        toPut.textContent = '🖊';
        titleOfTask.textContent = details.titleOfTask;
        newTask.className = "newTask"
        titleOfTask.id = 'titleOfTask' + `${j++}`;
        newTask.dataTarget = titleOfTask.id;
        titleOfTask.className = 'titleOfTask'
        toDelete.className = 'buttonOfTask';
        toPut.className = 'buttonOfTask';
        newTask.append(toDelete);
        newTask.append(toPut);
        newTask.append(titleOfTask);
        let colorByType = document.createElement('p');
        if (details.typeOfTask === "🔴מטלה דחופה") {
            colorByType.innerHTML = '🔴';
        }
        if (details.typeOfTask === '🟡מטלה חשובה') {
            colorByType.innerHTML = '🟡';
        }
        if (details.typeOfTask === '🟢מטלה רגילה') {
            colorByType.innerHTML = '🟢';
        }
        newTask.append(colorByType);
        if (type === 'DELETE' || type === 'search') {
            tasksDiv.append(newTask);
        }
        else {
            tasksDiv.prepend(newTask);
        }

        toPut.addEventListener('click', () => {
            let messegeToPut = document.createElement('p');
            messegeToPut.className = 'messege';
            messegeToPut.textContent = "מלא את הפרטים לעדכון";
            windowToNewTaskDetails(messegeToPut, 'PUT',idOfTaskDiv);
        })

        toDelete.addEventListener('click', () => {
            addRequestOfDelete(idOfTaskDiv);
        })
    }
    //חלונית להכנסת נתוני המטלה
    function windowToNewTaskDetails(messege, type,idOfTaskDiv) {
        toAppendTheNewTask.style.width = '70vw';
        toAppendTheNewTask.style.height = '100vh';
        toAppendTheNewTask.style.position = 'fixed';
        newDivToNewTask.style.height = '50vh';
        newDivToNewTask.style.width = '30vw';
        newDivToNewTask.style.alignItems = 'center';
        newDivToNewTask.style.textAlign = 'center';
        newDivToNewTask.style.backgroundColor = '#fbf7f7';
        newDivToNewTask.style.borderRadius = '20%';
        newDivToNewTask.style.outline = 'auto';
        newDivToNewTask.style.marginLeft = '15vw';
        newDivToNewTask.style.position = 'fixed';
        newDivToNewTask.append(addButtonClose());
        newDivToNewTask.append(messege);
        newDivToNewTask.append(addButtonType());
        newDivToNewTask.append(addButtonTitle());
        newDivToNewTask.append(addButtonSend(type,idOfTaskDiv));
    }
    //הסרת החלונית להכנסת פרטי מטלה
    function toRemoveMessegeStyleOfWindowDetails() {
        toAppendTheNewTask.style.width = '0';
        toAppendTheNewTask.style.height = '0';
        toAppendTheNewTask.style.position = 'none';
        newDivToNewTask.style.height = '0';
        newDivToNewTask.style.width = '0';
        newDivToNewTask.style.backgroundColor = 'none';
        newDivToNewTask.style.borderRadius = '0';
        newDivToNewTask.style.outline = 'none';
        newDivToNewTask.style.marginLeft = '0';
        newDivToNewTask.innerHTML = '';
    }
    //הוספת כפתור סוג מטלה
    function addButtonType() {
        let selectElement = document.createElement("select");
        selectElement.className = 'choose';
        selectElement.id = "buttonTask";
        let options = ["🔴מטלה דחופה", "🟡מטלה חשובה", "🟢מטלה רגילה"]
        options.forEach((option) => {
            let optionElement = document.createElement("option")
            optionElement.value = option;
            optionElement.textContent = option;
            selectElement.appendChild(optionElement);
        });
        return selectElement;
    }
    //הוספת כפתור לכותרת מטלה
    function addButtonTitle() {
        let inputElement = document.createElement("input");
        inputElement.type = "input";
        inputElement.placeholder = 'מלא את נושא המטלה';
        inputElement.maxLength = "30";
        inputElement.className = 'choose';
        inputElement.id = "buttonTitle";
        return inputElement;
    }
    //הוספת כפתור לשליחה של מטלה שנוספה-התעדכנה
    function addButtonSend(type,idOfTaskDiv) {
        let buttonElementSend = document.createElement("button");
        buttonElementSend.textContent = "עדכון";
        buttonElementSend.type = "button";
        buttonElementSend.className = 'buttomToSend';
        buttonElementSend.addEventListener('click', () => {
            let myTypeOfTask = document.getElementById("buttonTask").value;
            let myTitleOfTask = document.getElementById("buttonTitle").value;

            let details = {
                typeOfTask: myTypeOfTask,
                titleOfTask: myTitleOfTask,
                idOfTask: 0
            }
            toRemoveMessegeStyleOfWindowDetails();
            if (type === 'POST') {
                addRequestOfPost(details);
            }
            if (type === 'PUT') {
                details.idOfTask = idOfTaskDiv;
                addRequestOfPut( details);
            }
        })
        return buttonElementSend;
    }
    //הוספת כפתור לסגירת אפשרות ההוספה
    function addButtonClose() {
        let buttonElementClose = document.createElement("button");
        buttonElementClose.textContent = "❌";
        buttonElementClose.type = "button";
        buttonElementClose.className = 'buttomToClose';
        buttonElementClose.addEventListener('click', () => {
            toRemoveMessegeStyleOfWindowDetails();
        })
        return buttonElementClose;
    }
    //הקפצת הודעה על בקשה שנשלחה בהצלחה
    function messegeAboatSucceedRequest(messege) {
        let jampMessege = document.createElement("div");
        jampMessege.id = "jampMessegeActive";
        jampMessege.append(messege);
        main.prepend(jampMessege);
        setTimeout(() => {
            jampMessege.id = "jampMessegeNotActive";
        }, 1000);
    }
    //הוספת כפתור התנתקות
    let logOut = document.getElementById("logOut");
    logOut.addEventListener('click', () => {
        showContent(1);
    });
} 

//הקפצת הודעה במקרה שהסטטוס בעיתי
 function alertInErrorStatus(fxhr) {
    if (fxhr.status === 404) {
        alert("שגיאה 404 הכתובת המבוקשת לא נמצאה");
    }
    else {
        if (fxhr.status === 100) {
            alert("שגיאה 100, בעיה בשליחת הנתונים");
        }
        else {
            alert("שגיאה");
        }
    }
}