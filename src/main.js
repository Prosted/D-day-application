//global---------------------------------------------------------
const goSearchBtns = document.querySelectorAll(".goSearch");
//search D-day-----------------------------------------
const searchContainer = document.querySelector(".search-container");
const searchForm = searchContainer.querySelector("form");
const searchInput = searchForm.querySelector("input");
const lists = searchContainer.querySelector(".lists");
//Set D-day---------------------------------------------
const setContainer = document.querySelector(".set-container");
const setForm = setContainer.querySelector("form");
const setDayInput = setForm.querySelector(".set-container__day");
const setNameInput = setForm.querySelector(".set-container__name");
//Create a new D-day-------------------------------------
const createBtn = document.querySelector(".create");
//process container--------------------------------------
const processContainer = document.querySelector(".process-container");
const processName = processContainer.querySelector(".process-name");
const processDate = processContainer.querySelector(".process-date");
const goalDate = processContainer.querySelector(".goal-date");
const processBar = processContainer.querySelector(".process-bar");
const dueDateCount = processContainer.querySelector(".dueDate-count");  
const dueDate = processContainer.querySelector(".dueDate");
const deleteBtn = processContainer.querySelector(".delete");

const daysArr = ["일", "월", "화", "수", "목", "금", "토", "일"];
let counter;

const showProcess = (info) => {
    if (counter){
        clearInterval(counter);
    }
    processContainer.classList.remove("hidden");
    //이름
    processName.innerText = info.name;
    //10
    goalDate.innerText = info.goalNumber;
    //1
    const processNumber = new Date().getDate() - new Date(info.currentDate).getDate() + 1;
    processDate.innerText = processNumber;
    //목표날짜
    const myDueDate = new Date(info.goalDate);
    const whatDay = daysArr[myDueDate.getDay()];
    dueDate.innerText = `${myDueDate.toLocaleString()} ${whatDay}`;
    //백분율
    processBar.max = info.goalNumber;
    processBar.value = (processNumber / info.goalNumber) * 100;
    //카운트다운
    const _second = 1000;
    const _minute = _second * 60;
    const _hour = _minute * 60;
    const _day = _hour * 24;
    const _months = _day * 31;

    let newDate = new Date();
    let distance = myDueDate - newDate;

    let months = Math.floor(distance/_months);
    let days = Math.floor(distance / _day);
    let hours = Math.floor((distance % _day) / _hour);
    let minutes = Math.floor((distance % _hour) / _minute);
    let seconds = Math.floor((distance % _minute) / _second);

    dueDateCount.innerText = `[남은 기간 약 ${months >10 ? months : `0${months}`}개월]  ${days >10 ? days : `0${days}`}일 : ${hours >10 ? hours : `0${hours}`}시간 : ${minutes >10 ? minutes : `0${minutes}`}분 : ${seconds >10 ? seconds : `0${seconds}`}초`
    counter = setInterval(()=>{
        if (distance<0){
            clearInterval(counter);
            alert("축하합니다. 달성하셨습니다.");
            return;
        }
        newDate = new Date();
        distance = myDueDate - newDate;

        months = Math.floor(distance/_months);
        days = Math.floor(distance / _day);
        hours = Math.floor((distance % _day) / _hour);
        minutes = Math.floor((distance % _hour) / _minute);
        seconds = Math.floor((distance % _minute) / _second);
        if(hours===0 && minutes===0 && seconds===0){
            processNumber+=1;
            processDate.innerText = processNumber;
        }
        dueDateCount.innerText = `[남은 기간 약 ${months >10 ? months : `0${months}`}개월] ${days >10 ? days : `0${days}`}일 : ${hours >10 ? hours : `0${hours}`}시간 : ${minutes >10 ? minutes : `0${minutes}`}분 : ${seconds >10 ? seconds : `0${seconds}`}초`
    },1000);
}


const handleSet = (event) => {
    event.preventDefault();
    const new_dDay = setDayInput.value;
    //백엔드에서 day 범위 초과 검사하기
    if(Number(new_dDay)<1 || Number(new_dDay) >365){
        alert("입력 가능한 범위를 넘었습니다.");
        dDaysetDayInput.value="";
        return;
    }
    const new_name = setNameInput.value;
    const nameExists = localStorage.getItem(new_name);
    if(nameExists){
        alert("중복된 이름의 D-day가 있습니다.");
        setDayInput.value="";
        setNameInput.value="";
        return;
    }
    const currentDate = new Date();
    const goalDate = new Date();
    goalDate.setDate(currentDate.getDate() + Number(new_dDay));
    const dDayObj = {
        currentDate,
        goalDate,
        goalNumber : new_dDay,
        name : new_name,
    }
    setDayInput.value="";
    setNameInput.value="";
    setContainer.classList.add("hidden");
    localStorage.setItem(new_name, JSON.stringify(dDayObj));
    addFakeList(new_name);
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
    const value = localStorage.getItem(name);
    if(!value){
        alert(`검색한 "${name}" D-day가 없습니다.`);
        searchInput.value=""
        return;
    }
    searchInput.value=""
    searchContainer.classList.add("hidden");
    processContainer.classList.remove("hidden");
    showProcess(JSON.parse(value));
}

const handleCreate = (event) => {
    searchContainer.classList.add("hidden");
    setContainer.classList.remove("hidden");
}

const handleDelete = (event) => {
    clearInterval(counter);
    const name = processName.innerText;
    localStorage.removeItem(name);
    const fakeLi = lists.querySelector(`#${name}`);
    lists.removeChild(fakeLi);
    processContainer.classList.add("hidden");
    if(localStorage.length <=0){
        setContainer.classList.remove("hidden");
    }else{
        searchContainer.classList.remove("hidden");
    }
}

const handleGoSearch = () =>{
    clearInterval(counter);
    searchContainer.classList.remove("hidden");
    setContainer.classList.add("hidden");
    processContainer.classList.add("hidden");
}

const moveToProcess = (event) => {
    const {innerText} = event.target;
    const obj = localStorage.getItem(innerText);
    const parsedObj = JSON.parse(obj);
    searchContainer.classList.add("hidden");
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

function init(){
    const dataExists = localStorage.length;
    if(!dataExists){
        handleCreate();
    }
    setForm.addEventListener("submit", handleSet);
    searchForm.addEventListener("submit", handleSearch);
    createBtn.addEventListener("click", handleCreate);
    deleteBtn.addEventListener("click", handleDelete);
    goSearchBtns.forEach(btn => {
        btn.addEventListener("click", handleGoSearch);
    });
    print_dDays();
}

init();

