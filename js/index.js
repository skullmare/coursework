let page = 1
let countRecords = 4
let API = '39e44460-f6f2-42a4-ad50-cb271734b64a'
let URLRoutes = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=${API}`;
let DataRoutes = null; // массив всех маршрутов
let DataRoutesSearch = null; // массив маршрутов по результату поиска
let searchRoutesMainObject = null; // переменная с результатом поиска по основным обьектам
let searchRoutesName = null; // переменная с результатом поиска по названию
let selectedRouteId = null; // айди выбранного маршрута
let selectedRouteName = null; // название выбранного маршрута
let DataGuides = null; // массив всех гидов
let searchLanguage = null; // переменная с результатом поиска по языкам
let DataGuidesSearch = null; // массив гидов по результату поиска
let selectedGuideId = null; // айди выбранного гида


// загрузка JSON из API
function loadDATARoutes() {
    fetch(URLRoutes)
        .then(function (response) {
            return response.json();
        }).then(function (myJSON) {
            DataRoutes = myJSON;
            renderOptionMainObject(DataRoutes)
        });
}

function loadDATAGuides() {
    let URLGuides = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/${selectedRouteId}/guides?api_key=${API}`;
    fetch(URLGuides)
        .then(function (response) {
            return response.json();
        }).then(function (myJSON) {
            DataGuides = myJSON;
            renderOptionLanguage()
        });
}


let intervalLoadDATARoutes = setInterval(goRoutes, 1000)


function goRoutes() {
    if (DataRoutes != null) {


        // -----------------------------------

        if (searchRoutesName != null) {
            DataRoutesSearch = DataRoutes.filter(function (DataRoutes) {
                return DataRoutes.name.includes(searchRoutesName);
            });
        } else if (searchRoutesMainObject != null) {
            DataRoutesSearch = DataRoutes.filter(function (DataRoutes) {
                return DataRoutes.mainObject.includes(searchRoutesMainObject);
            });
        } else {
            DataRoutesSearch = null;
        }



        // -----------------------------------
        if (DataRoutesSearch != null) {
            renderRoutesGo(DataRoutesSearch)
        }
        else {
            renderRoutesGo(DataRoutes)
        }

        // -----------------------------------





        // -----------------------------------
        clearInterval(intervalLoadDATARoutes);
    }
}


let intervalLoadDATAGuides = null;



document.querySelector('.guidesBlock').style.display = 'none'



function goGuides() {
    if (DataGuides != null) {
        if (searchLanguage != null) {
            DataGuidesSearch = DataGuides.filter(function (DataGuides) {
                return DataGuides.language.includes(searchLanguage);
            });
        } else {
            DataGuidesSearch = null;
        }


        // -----------------------------------
        if (DataGuidesSearch != null) {
            renderGuidesGo(DataGuidesSearch)
        }
        else {
            renderGuidesGo(DataGuides)
        }







        // -----------------------------------
        clearInterval(intervalLoadDATAGuides);
    }
}






function renderRoutesGo(DataRoutes) {
    renderBtnPage(DataRoutes.length)
    renderRoutes(DataRoutes, countRecords)
}

function renderGuidesGo(DataGuides) {
    renderGuides(DataGuides)
}




// заполнение таблицы
const renderRoutes = (DATARoutes, countRecords) => {
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
            if (DATARoutes[i].id == selectedRouteId) {
                let tr = clone.querySelector('tr')
                tr.classList.add('selected-route');
            }
            name.textContent = DATARoutes[i].name;
            description.textContent = DATARoutes[i].description;
            mainObject.textContent = DATARoutes[i].mainObject;
            btnLoadGuides.id = DATARoutes[i].id;
            routes.append(clone);
        }
        catch {
        }


    }
    eventbtnLoadGuides();
    // -----------------------------------
}


const renderGuides = (DataGuides) => {
    selectedRouteName = DataRoutes.find(Data => Data.id == selectedRouteId).name;
    let titleGuides = document.querySelector('.titleGuides');
    titleGuides.textContent = 'Доступные гиды по маршруту ' + '"' + selectedRouteName + '"';


    let guides = document.querySelector('.guides');
    let template = document.querySelector('#guide');
    guides.innerHTML = '';
    for (let i = 0; i < DataGuides.length; i++) {
        let clone = template.content.cloneNode(true);
        let nameGuide = clone.querySelector('.nameGuide');
        let language = clone.querySelector('.language');
        let workExperience = clone.querySelector('.workExperience');
        let pricePerHour = clone.querySelector('.pricePerHour');
        let btnLoadApplication = clone.querySelector('.btnLoadApplication');
        nameGuide.textContent = DataGuides[i].name;
        language.textContent = DataGuides[i].language;
        workExperience.textContent = DataGuides[i].workExperience;
        pricePerHour.textContent = DataGuides[i].pricePerHour + ' ₽';
        btnLoadApplication.id = DataGuides[i].id;
        guides.append(clone)
    }
    eventbtnLoadApplication();
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
            goRoutes();
        })
    }
}
const eventbtnLoadGuides = () => {
    let btnLoadGuides = document.querySelectorAll('.btnLoadGuides')

    // -----------------------------------
    for (let i = 0; i < btnLoadGuides.length; i++) {
        btnLoadGuides[i].addEventListener('click', function () {
            document.querySelector('.guidesBlock').style.display = 'block';
            selectedRouteId = btnLoadGuides[i].id;
            goRoutes();
            searchLanguage = null;
            DataGuidesSearch = null;
            loadDATAGuides();

            intervalLoadDATAGuides = setInterval(goGuides, 1000);
        })
    }

}
const eventbtnLoadApplication = () => {
    let btnLoadApplication = document.querySelectorAll('.btnLoadApplication')

    // -----------------------------------
    for (let i = 0; i < btnLoadApplication.length; i++) {
        btnLoadApplication[i].addEventListener('click', function () {
            selectedGuideId = btnLoadApplication[i].id;
            let selectedGuideName = DataGuides.find(Data => Data.id == selectedGuideId).name;
            let selectedGuidePrice = DataGuides.find(Data => Data.id == selectedGuideId).pricePerHour;
            let fioGuideApplication = document.querySelector('.fioGuideApplication');
            let nameRouteApplication = document.querySelector('.nameRouteApplication');
            fioGuideApplication.textContent = selectedGuideName;
            nameRouteApplication.textContent = selectedRouteName;
        })
    }

}


// функция усечения текста
function truncate(str, max) {
    return str.length > max ? str.substr(0, max - 1) + '...' : str;
}


// генерация выпадающего списка основных обьектов
const renderOptionMainObject = (DATARoutes) => {
    let selectMainObjects = document.querySelector('.selectMainObjects');
    let template = document.querySelector('#optionMainObject');
    let arrayMainObjects = []
    let splitMainObject = []
    let finalArrayMainObject = []
    for (let i = 0; i < DATARoutes.length; i++) {
        arrayMainObjects.push(DATARoutes[i].mainObject);
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

// генерация выпадающего списка доступных языков
const renderOptionLanguage = () => {
    let selectLanguages = document.querySelector('.selectLanguages');
    let template = document.querySelector('#optionLanguage');
    selectLanguages.innerHTML = ''
    let selectedNull = document.createElement('option');
    selectedNull.classList.add('optionLanguage')
    selectedNull.innerText = 'Не выбрано';
    selectLanguages.appendChild(selectedNull);
    // -----------------------------------
    for (let i = 0; i < DataGuides.length; i++) {
        let clone = template.content.cloneNode(true);
        let optionLanguage = clone.querySelector('.optionLanguage');
        optionLanguage.textContent = DataGuides[i].language;
        selectLanguages.append(clone);
    }
}

// событие для выпадающего списка доступных языков
const eventSelectLanguage = () => {
    let selectLanguages = document.querySelector('.selectLanguages');
    selectLanguages.addEventListener('change', function () {
        searchLanguage = selectLanguages.value;
        if (searchLanguage == 'Не выбрано') {
            searchLanguage = null;
        }
        goGuides();
    })
}


// событие для выпадающего списка поиска
const eventSelectMainObject = () => {
    let selectMainObjects = document.querySelector('.selectMainObjects');
    // -----------------------------------
    selectMainObjects.addEventListener('change', function () {
        if ((selectMainObjects.value).length > 60) {
            searchRoutesMainObject = (selectMainObjects.value).slice(0, -3); // убираем точки в конце
        } else {
            searchRoutesMainObject = selectMainObjects.value;
        }
        if (searchRoutesMainObject == 'Не выбрано') {
            searchRoutesMainObject = null;
        }
        page = 1;
        searchRoutesName = null;
        goRoutes();
    })
}

let inputSearch = document.querySelector('.inputSearch');
inputSearch.addEventListener('input', function () {
    searchRoutesName = inputSearch.value;
    if (searchRoutesName == '') {
        searchRoutesName = null;
    }
    page = 1;
    searchRoutesMainObject = null;
    goRoutes();
})

eventSelectLanguage();
eventSelectMainObject()
window.onload = loadDATARoutes()