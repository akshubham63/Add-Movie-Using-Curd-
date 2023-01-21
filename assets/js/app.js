const cl = console.log;

// declarations
const backDrop = document.getElementById('backDrop');
const movieModel = document.getElementById("movieModel");
const addMovie = document.getElementById("addMovie");
const myClose = [...document.querySelectorAll(".myClose")];
const movieCardContainer = document.getElementById("movieCardContainer");
const title = document.getElementById("title");
const imgUrl = document.getElementById("imgUrl");
const rating = document.getElementById("rating");
const updateMovieBtn = document.getElementById("updateMovie");
const movieDetailsForm = document.getElementById("movieDetailsForm");
const searchMovie = document.getElementById("searchMovie");
const suggestionBox = document.getElementById("suggestionBox");
const searchIcon = document.getElementById("searchIcon");
const btn = document.getElementById("btn");




let moviesArr = [];// store the object of movies

function templating(arr){
    let result = ``;
    arr.forEach(ele => {
    result += `
        <div class="col-sm-3 mb-3">
            <div class="card myMovieCard" onMouseOver="iconShow(this)" onMouseLeave="iconHide(this)">
                <div class="card-header">
                    <h3 class="text-capitalize">${ele.title}</h3>
                </div>
                <div class="card-body movieImgContainer">
                    <img src="${ele.imgUrl}" alt="${ele.title} Image" title="${ele.title}" class="img-fluid movieImg">
                </div>
                <div class="card-footer">
                    <div class="icon d-inline-block">
                        <i class="fa-solid fa-pen-to-square text-info d-none" onClick="onEditHandler(this)" data-id="${ele.id}"></i>
                        <i class="fa-solid fa-trash text-danger d-none" onClick="onDeleteHandler(this)" data-id="${ele.id}"></i>
                    </div>
                    <h5 class="d-inline-block float-right p-1">
                        ${ele.rating}/10
                    </h5>
                </div>
            </div>
        </div>
    `;
    });

movieCardContainer.innerHTML = result;
};

const UUIDGeneratorBrowser = () =>
  ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );

// callback functions
if(localStorage.getItem("movieDetails")){
    moviesArr = JSON.parse(localStorage.getItem("movieDetails"));
    templating(moviesArr);
};

const storeMovieArr = () => {
    localStorage.setItem("movieDetails",JSON.stringify(moviesArr));
};

const onToggleCloseHandler = (eve) =>{
    backDrop.classList.toggle("d-none");
    movieModel.classList.toggle("d-none");
};// function for the dropdown and movieModel to show and hide

const onFormRest = (eve) => {
    title.value = "";
    imgUrl.value = "";
    rating.value = "";
    updateMovieBtn.classList.add("d-none");
    addMovie.classList.remove("d-none");
}

const movieAddHandler = (e) =>{
    let obj;
    if(title.value.length === 0 && imgUrl.value.length === 0 && rating.value.length === 0){
         obj = {
            title : ``,
            imgUrl : ``,
            rating : ``,
            id : UUIDGeneratorBrowser(),
        };
    }else{
        obj = {
                title : title.value,
                imgUrl : imgUrl.value,
                rating : rating.value,
                id : UUIDGeneratorBrowser(),
            };
    };
    moviesArr.unshift(obj);
    storeMovieArr();
    // templating(moviesArr);
    let div = document.createElement("div");
    div.className = `col-sm-3 mb-3`;
    // div.setAttribute("onMouseOver","iconShow(this)");
    div.innerHTML = 
                    `<div class="card myMovieCard" onMouseOver="iconShow(this)" onMouseLeave="iconHide(this)">
                        <div class="card-header">
                            <h3 class="text-capitalize">${obj.title}</h3>
                        </div>
                        <div class="card-body movieImgContainer">
                            <img src="${obj.imgUrl}" alt="${obj.title} Image" title="${obj.title}" class="img-fluid movieImg">
                        </div>
                        <div class="card-footer">
                            <div class="icon d-inline-block">
                                <i class="fa-solid fa-pen-to-square text-info d-none" onClick="onEditHandler(this)" data-id="${obj.id}"></i>
                                <i class="fa-solid fa-trash text-danger d-none" onClick="onDeleteHandler(this)" data-id="${obj.id}"></i>
                            </div>
                            <h5 class="d-inline-block float-right p-1">
                                ${obj.rating}/10
                            </h5>
                        </div>
                    </div>`
    ;
movieCardContainer.append(div);
};// function for to create the object after fill up the form and store in movieArr array.

const onEditHandler = (ele) => {
    // cl(ele);
    // let editId = ele.getAttribute("data-id");
    let editId = ele.dataset.id;// alternate way for geting id in custom attribute
    sessionStorage.setItem("updateId",editId);
    // cl(editId);
    let editMovie = moviesArr.find(movie => movie.id === editId);
    title.value = editMovie.title;
    imgUrl.value = editMovie.imgUrl;
    rating.value = editMovie.rating;
    backDrop.classList.remove("d-none");
    movieModel.classList.remove("d-none");
    addMovie.classList.add("d-none");
    updateMovieBtn.classList.remove("d-none");

    storeMovieArr();
};

const onDeleteHandler = (ele) => {
    // cl(ele);
    let deleteId = ele.dataset.id;
    // cl(deleteId);
    let deleteObjIndex = moviesArr.findIndex(movie => movie.id === deleteId);
    moviesArr.splice(deleteObjIndex,1);
    storeMovieArr();
    let deleteEle = ele.parentElement.parentElement.parentElement;
    deleteEle.remove();
};

const onUpdateHandler = (ele) => {
    let updateId = sessionStorage.getItem("updateId");
    // cl(updateId);
    let updateObj = moviesArr.find(movie => movie.id === updateId);
    updateObj.title = title.value;
    updateObj.imgUrl = imgUrl.value;
    updateObj.rating = rating.value;

    storeMovieArr();
    let allDataEle = [...document.querySelectorAll("#movieCardContainer [data-id]")];
    let updateEle = allDataEle.find(ele => ele.dataset.id === updateId);
    let updateMovieCard = updateEle.parentElement.parentElement.parentElement;
    // cl(updateMovieCard);
    updateMovieCard.innerHTML = `
            <div class="card-header">
                <h3 class="text-capitalize">${updateObj.title}</h3>
            </div>
            <div class="card-body movieImgContainer">
                <img src="${updateObj.imgUrl}" alt="${updateObj.title} Image" title="${updateObj.title}" class="img-fluid movieImg">
            </div>
            <div class="card-footer">
                <div class="icon d-inline-block">
                    <i class="fa-solid fa-pen-to-square text-info d-none" onClick="onEditHandler(this)" data-id="${updateObj.id}"></i>
                    <i class="fa-solid fa-trash text-danger d-none" onClick="onDeleteHandler(this)" data-id="${updateObj.id}"></i>
                </div>
                <h5 class="d-inline-block float-right p-1">
                    ${updateObj.rating}/10
                </h5>
            </div>
            `;
    backDrop.classList.add("d-none");
    movieModel.classList.add("d-none");
    updateMovieBtn.classList.add("d-none");
    addMovie.classList.remove("d-none");
    movieDetailsForm.clear();
};

const onSearchHandler = (eve) => {
    // cl(eve.target.value.length);
    let result = [];
    let inputValue = eve.target.value;
    if(inputValue.length !== 0){
        showErrorMassage.classList.add("d-none");
    };
    if(inputValue.length){
        result = moviesArr.map(ele => ele.title).filter(ele => ele.trim().toLowerCase().includes(inputValue));
    };
    showResult(result);
    
    // to show search movie only
    movieSearch();
};

const showResult = (arr) => {
    if(arr.length === 0){
        return;
    }
    let movieName = arr.map(ele => `<li>${ele}</li>`).join("");// use join because we need to put movieName in form of string to the ul part
    // cl(movieName);
    suggestionBox.classList.remove("d-none");
    suggestionBox.innerHTML = `<ul>${movieName}</ul>`;
    let li = document.querySelectorAll("#suggestionBox li");
    li.forEach(ele => ele.setAttribute("onclick","select(this)"));
};

const select = (ele) => {
    searchMovie.value = ele.innerText;
    showErrorMassage.classList.remove("d-none");
    suggestionBox.classList.add("d-none");
    showErrorMassage.classList.add("d-none");
    movieSearch();
};

const onSearchIconHandler = (eve) => {
    if(searchMovie.value.length === 0){
        showErrorMassage.classList.remove("d-none");
    }
};

// to show search movie only
const movieSearch = () => {
    let inputValue = searchMovie.value;
    let allMovieCard = [...document.querySelectorAll("#movieCardContainer .col-sm-3")];
    let allTitle = [...document.querySelectorAll("#movieCardContainer .card-header h3")];
    allMovieCard.forEach(ele => ele.classList.add("d-none"));
    allTitle.forEach(ele => {
        if(ele.innerText.trim().toLowerCase().includes(inputValue)){
            let col3Div = ele.parentElement.parentElement.parentElement;
            col3Div.classList.remove("d-none");
        };
    });
};

// on mouse over
const iconShow = (ele) => {
    let myMovieCardEle = ele.children;
    let cardFooterEle = myMovieCardEle[myMovieCardEle.length - 1].children;
    let myIconEle = [...cardFooterEle[0].children];
    myIconEle.forEach(ele => ele.classList.remove("d-none"));
};

// on mouse move 
const iconHide = (ele) => {
    let myMovieCardEle = ele.children;
    let cardFooterEle = myMovieCardEle[myMovieCardEle.length - 1].children;
    let myIconEle = [...cardFooterEle[0].children];
    myIconEle.forEach(ele => ele.classList.add("d-none"));
};


// events
myClose.forEach(ele => ele.addEventListener("click",onToggleCloseHandler));
// close the movieModel after click on the cancel and add movie ,etc.
backDrop.addEventListener("click", onToggleCloseHandler);
addMovie.addEventListener("click",movieAddHandler);
updateMovieBtn.addEventListener("click", onUpdateHandler);
searchMovie.addEventListener("keyup", onSearchHandler);
searchIcon.addEventListener("click", onSearchIconHandler);
btn.addEventListener("click", onFormRest);