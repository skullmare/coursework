let page = 1
let countRecords = 4
let API = '39e44460-f6f2-42a4-ad50-cb271734b64a'
let URL = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=${API}`;
let Data = null;
let DataSearch = null;
let searchMainObject = null;
let searchName = null;

let isResizeble = false;

// загрузка JSON из API
function loadDATA() {
    fetch(URL)
        .then(function (response) {
            return response.json();
        }).then(function (myJSON) {
            Data = myJSON;
        });
}



let interval = setInterval(go, 1000)



function go() {
    if (Data != null) {


        // -----------------------------------
        if (searchName != null) {
            DataSearch = Data.filter(function (Data) {
                return Data.name.includes(searchName);
            });
        }
        if (searchMainObject != null) {
            DataSearch = Data.filter(function (Data) {
                return Data.mainObject.includes(searchMainObject);
            });
        }



        // -----------------------------------
        if (DataSearch != null) {
            render(DataSearch)
        }
        else {
            render(Data)
        }

        // -----------------------------------

        if (!isResizeble) {
            renderOptionMainObject(Data)
            isResizeble = true;
        }



        // -----------------------------------
        clearInterval(interval);
    }
}








function render(Data) {
    renderBtnPage(Data.length)
    renderRoutes(Data, countRecords)
}




// заполнение таблицы
const renderRoutes = (DATA, countRecords) => {
    let routes = document.querySelector('.routes'); // tbody
    let template = document.querySelector('#route'); // template
    routes.innerHTML = '';
    // -----------------------------------
    for (let i = (page * countRecords) - countRecords; i < (page * countRecords); i++) {
        let clone = template.content.cloneNode(true);
        let name = clone.querySelector('.name');
        let description = clone.querySelector('.description');
        let mainObject = clone.querySelector('.mainObject');
        let btnLoadGuides = clone.querySelector('.btnLoadGuides')
        try {
            name.textContent = DATA[i].name;
            description.textContent = DATA[i].description;
            mainObject.textContent = DATA[i].mainObject;
            btnLoadGuides.id = DATA[i].id;
            routes.append(clone);
        }
        catch {
        }


    }
    eventbtnLoadGuides();
    // -----------------------------------
}





// генерация кнопок для переключения страниц записей
const renderBtnPage = (length) => {
    let count = Math.floor(length / countRecords) + 1;
    let blockBtns = document.querySelector('.blockBtns');
    let template = document.querySelector('#btnPage'); // template
    blockBtns.innerHTML = '';
    // -----------------------------------
    for (let i = 1; i <= count; i++) {
        let clone = template.content.cloneNode(true);
        let btnPage = clone.querySelector('.btnPage');
        btnPage.value = i;
        blockBtns.append(clone);
    }
    // -----------------------------------
    eventBtnPages()
}





// событие для кнопок переключения страниц записей
const eventBtnPages = () => {
    let btnPages = document.querySelectorAll('.btnPage')
    // -----------------------------------
    for (let i = 0; i < btnPages.length; i++) {
        btnPages[i].addEventListener('click', function () {
            page = i + 1;
            go();
        })
    }
}
const eventbtnLoadGuides = () => {
    let btnLoadGuides = document.querySelectorAll('.btnLoadGuides')
    // -----------------------------------
    for (let i = 0; i < btnLoadGuides.length; i++) {
        btnLoadGuides[i].addEventListener('click', function () {
            console.log(btnLoadGuides[i].id)
        })
    }

}


// функция усечения текста
function truncate(str, max) {
    return str.length > max ? str.substr(0, max - 1) + '...' : str;
}


// генерация выпадающего списка основных обьектов
const renderOptionMainObject = (DATA) => {
    let selectMainObjects = document.querySelector('.selectMainObjects');
    let template = document.querySelector('#optionMainObject');
    let arrayMainObjects = []
    let splitMainObject = []
    let finalArrayMainObject = []
    for (let i = 0; i < DATA.length; i++) {
        arrayMainObjects.push(DATA[i].mainObject);
    }    
    for (let i = 0; i < arrayMainObjects.length; i++) {
        splitMainObject = arrayMainObjects[i].split(/\-|–|—/);
        finalArrayMainObject.push(splitMainObject)
    }
    finalArrayMainObject = finalArrayMainObject.flat()
    // -----------------------------------
    for (let i = 0; i < finalArrayMainObject.length; i++) {
        let clone = template.content.cloneNode(true);
        let optionMainObject = clone.querySelector('.optionMainObject');
        optionMainObject.textContent = truncate(finalArrayMainObject[i], 60); // усекаем строки и добавляем троеточие
        selectMainObjects.append(clone);
    }
}





// событие для выпадающего списка поиска
const eventSelectMainObject = () => {
    let selectMainObjects = document.querySelector('.selectMainObjects');
    // -----------------------------------
    selectMainObjects.addEventListener('change', function () {
        if ((selectMainObjects.value).length > 60) {
            searchMainObject = (selectMainObjects.value).slice(0,-3); // убираем точки в конце
        } else {
            searchMainObject = selectMainObjects.value;
        }
        if (searchMainObject == 'Не выбрано') {
            searchMainObject = '';
        }
        page = 1;
        searchName = null;
        go();
    })
}

let inputSearch = document.querySelector('.inputSearch');
inputSearch.addEventListener('input', function () {
    searchName = inputSearch.value;
    page = 1;
    searchMainObject = null;
    go();
})


eventSelectMainObject()
window.onload = loadDATA()