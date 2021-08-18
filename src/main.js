//nav---------------------------------------------------------
const nav = document.querySelector(".nav");
const goSearchBtn = nav.querySelector(".nav__search");
const goCreateBtn = nav.querySelector(".nav__create");
//aside-------------------------------------------------------
const lists = document.querySelector(".lists");
//search----------------------------------------
const searchContainer = document.querySelector(".search-container");
const searchForm = searchContainer.querySelector(".searchForm");
const searchInput = searchForm.querySelector(".searchForm__input");
//Set---------------------------------------------
const setContainer = document.querySelector(".set-container");
const setForm = setContainer.querySelector(".setForm");
const setNameInput = setForm.querySelector(".setForm__name");
const setDayInput = setForm.querySelector(".setForm__day");
//process--------------------------------------
const processContainer = document.querySelector(".process-container");
const processName = processContainer.querySelector(".process__name");
const processTexts = processContainer.querySelector(".process__texts");
const processDate = processTexts.querySelector(".process__texts__current");
const goalDate = processTexts.querySelector(".process__texts__goal");
const processBar = processContainer.querySelector(".process-bar");
const processCounter = processContainer.querySelector(".counter");  
const dueDate = processContainer.querySelector(".process__dueDate");
const deleteBtn = processContainer.querySelector(".deleteBtn");

const daysArr = ["일", "월", "화", "수", "목", "금", "토", "일"];
let counter;

const showProcess = (info) => {
    //이름
    processName.innerText = info.name;
    //목표일수
    goalDate.innerText = info.goalNumber;
    //현재진행일수
    const processNumber = new Date().getDate() - new Date(info.createdAt).getDate() + 1;
    processDate.innerText = processNumber;
    //목표날짜
    const myDueDate = new Date(info.goalDate);
    const whatDay = daysArr[myDueDate.getDay()];
    dueDate.innerText = `${myDueDate.toLocaleString()} ${whatDay}`;
    //백분율
    processBar.value = Math.floor((processNumber / info.goalNumber) * 100);
    //카운트다운
    const _second = 1000;
    const _minute = _second * 60;
    const _hour = _minute * 60;
    const _day = _hour * 24;
    
    let newDate = new Date();
    let distance = myDueDate - newDate; //myDueDate code 이 함수 안 몇줄 위에 있음.

    let days = Math.floor(distance / _day);
    let hours = Math.floor((distance % _day) / _hour);
    let minutes = Math.floor((distance % _hour) / _minute);
    let seconds = Math.floor((distance % _minute) / _second);
    processCounter.innerText = `${days >=10 ? days : `0${days}`}일 : ${hours >=10 ? hours : `0${hours}`}시간 : ${minutes >=10 ? minutes : `0${minutes}`}분 : ${seconds >=10 ? seconds : `0${seconds}`}초`;
    
    counter = setInterval(()=>{
        if (distance<0){
            clearInterval(counter);
            alert("축하합니다. 달성하셨습니다.");
            return goSearch();
        }
        newDate = new Date();
        distance = myDueDate - newDate;

        days = Math.floor(distance / _day);
        hours = Math.floor((distance % _day) / _hour);
        minutes = Math.floor((distance % _hour) / _minute);
        seconds = Math.floor((distance % _minute) / _second);
        if(hours===0 && minutes===0 && seconds===0){
            processNumber+=1; //현재진행일수 + 1
            processDate.innerText = processNumber;
        }
        processCounter.innerText = `${days >=10 ? days : `0${days}`}일 : ${hours >=10 ? hours : `0${hours}`}시간 : ${minutes >=10 ? minutes : `0${minutes}`}분 : ${seconds >=10 ? seconds : `0${seconds}`}초`;
    },1000);
}


const handleSet = (event) => {
    event.preventDefault();
    const new_day = Number(setDayInput.value);
    const new_name = setNameInput.value;
    //백엔드에서 day 범위 초과 검사하기
    if(new_day<1 || new_day >365){
        alert("입력 가능한 범위를 넘었습니다.");
        setNameInput="";
        setDayInput="";
        return;
    }
    //저장개수 초과 검사
    if(localStorage.length >= 5){
        alert("최대 5개까지 저장 가능합니다.");
        setNameInput="";
        setDayInput="";
        return;
    }
    //중복이름 검사
    const nameExists = localStorage.getItem(new_name);
    if(nameExists){
        alert("중복된 이름의 D-day가 있습니다.");
        setDayInput.value="";
        setNameInput.value="";
        return;
    }
    const createdAt = new Date();
    const goalDate = new Date();
    goalDate.setDate(createdAt.getDate() + new_day);
    const dDayObj = {
        createdAt,
        goalDate,
        goalNumber : new_day,
        name : new_name,
    }
    setDayInput.value="";
    setNameInput.value="";
    localStorage.setItem(new_name, JSON.stringify(dDayObj));
    addFakeList(new_name);
    goProcess();
    showProcess(dDayObj);
}

const addFakeList = (name) => {
    const li = document.createElement("li");
    li.innerText=name;
    li.id = name;
    li.addEventListener("click", moveToProcess);
    lists.appendChild(li);
}

const handleSearch = (event) => {
    event.preventDefault();
    const name = searchInput.value;
    const parsedobj = JSON.parse(localStorage.getItem(name));
    if(!parsedobj){
        alert(`검색한 "${name}" D-day가 없습니다.`);
        searchInput.value=""
        return;
    }
    searchInput.value=""
    goProcess();
    showProcess(parsedobj);
}

const handleDelete = (event) => {
    const name = processName.innerText;
    localStorage.removeItem(name);
    const fakeLi = lists.querySelector(`#${name}`);
    lists.removeChild(fakeLi);
    if(localStorage.length <=0){
        return goCreate();
    }else{
        return goSearch();
    }
}

const moveToProcess = (event) => {
    const {innerText} = event.target;
    const parsedObj = JSON.parse(localStorage.getItem(innerText));
    goProcess();
    showProcess(parsedObj);
}

const print_dDays = () =>{
    let i;
    for(i=0; i<localStorage.length; i++){
        const parsedObj = JSON.parse(localStorage.getItem(localStorage.key(i)));
        const name = parsedObj.name;
        const li = document.createElement("li");
        li.innerText = name;
        li.id=name;
        li.addEventListener("click", moveToProcess);
        lists.appendChild(li);
    }
}

const goSearch = () => {
    if(counter){
        clearInterval(counter);
    }
    searchContainer.classList.remove("hidden");
    setContainer.classList.add("hidden");
    processContainer.classList.add("hidden");
}

const goCreate = ()=>{
    if(counter){
        clearInterval(counter);
    }
    setContainer.classList.remove("hidden");
    searchContainer.classList.add("hidden");
    processContainer.classList.add("hidden");
}

const goProcess = () =>{
    if(counter){
        clearInterval(counter);
    }
    processContainer.classList.remove("hidden");
    setContainer.classList.add("hidden");
    searchContainer.classList.add("hidden");
}

function init(){
    const dataExists = localStorage.length;
    if(dataExists === 0){
        goCreate();
    }else{
        goSearch();
    }
    goSearchBtn.addEventListener("click", goSearch);
    goCreateBtn.addEventListener("click", goCreate);
    setForm.addEventListener("submit", handleSet);
    searchForm.addEventListener("submit", handleSearch);
    deleteBtn.addEventListener("click", handleDelete);
    print_dDays();
}

init();

