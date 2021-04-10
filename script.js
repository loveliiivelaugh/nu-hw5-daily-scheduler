//assigning global variables to DOM elements
const currentDay = document.querySelector("#currentDay");

//custom handleLocalStorage switch functionm, takes in type of action, which storage, and wether or not youre setting data.
const handleLocalStorage = (action, storageName, data) => {
  let storage = [];
  switch (action) {
    case "initialize":
      storage = localStorage.getItem(storageName) ? JSON.parse(localStorage.getItem(storageName)) : [];
      return storage;
    case "set":
      localStorage.setItem(storageName, JSON.stringify(data));
      break;
    case "get":
      storage = JSON.parse(localStorage.getItem(storageName));
      return storage;
    case "clear":
      localStorage.clear(storageName);
      break;
    default:
      break;
  }
};

//initialize local storage
let scheduleStorage = handleLocalStorage("initialize", "schedule");
//refresh our local scheduleStorage to be updated with the most current data.
const refreshScheduleStorage = () => scheduleStorage = handleLocalStorage("get", "schedule");

console.info(scheduleStorage);
// handleLocalStorage("clear", "schedule");
//set the current day using Moment.js wrapped in a function so it can be updated on call.
const setCurrentDay = () => currentDay.innerHTML = moment().format("dddd; MMMM-D-YY");

//using an array with 2 empty data objects in order to dynamically create space in our table
const headerCells = [
  {name:""},
  {name:""},
];

//array of time objects to be used when dynamically creating our time block cells.
const timeSlots = [
  { time: "8AM", hour: 8 },
  { time: "9AM", hour: 9 },
  { time: "10AM", hour: 10 },
  { time: "11AM", hour: 11 },
  { time: "12PM", hour: 12 },
  { time: "1PM", hour: 13 },
  { time: "2PM", hour: 14 },
  { time: "3PM", hour: 15 },
  { time: "4PM", hour: 16 },
  { time: "5PM", hour: 17 },
  { time: "6PM", hour: 18 },
];

//function that saves the contents typed into the input cell to local storage using a matching ID
const saveContents = event => {
  for (i = 0; i < scheduleStorage.length; i++) {
    if (event.target.dataset.time === scheduleStorage[i].cellId.split("-")[0]) {
      //once we matched the id with the item in the storage array then we want to splice the item from the array with the index.
      scheduleStorage.splice(event.target.dataset.index, 1);
    }
  }
  
  //cellContents is equal to the input targeted by the dynamic id, if there is one.
  const cellContents = document.getElementById(event.target.dataset.time+"-cell") &&
  document.getElementById(event.target.dataset.time+"-cell").value;

  // if there is a dataset time attribute
  if (event.target.dataset.time) {
    scheduleStorage.push({
      cellId: event.target.dataset.time+"-cell",
      cellContents: cellContents
    });
    handleLocalStorage("set", "schedule", scheduleStorage);
    refreshScheduleStorage();
    updateScheduleTable();
    console.info(scheduleStorage);
  }
};

const getCellContentsById = id => {
  for (i = 0; i < scheduleStorage.length; i++) {
    if (id === scheduleStorage[i].cellId) {
      return scheduleStorage[i].cellContents ? scheduleStorage[i].cellContents : '';
    }
  }
};

const setCellBackground = (hour) => {
  if (hour < moment().hour()) { return "table-light" || "table-past"; }
  else if (hour == moment().hour()) { return "table-danger" || "table-present"; }
  else if (hour > moment().hour()) { return "table-success" || "table-future"; }
};

const updateScheduleTable = () => {
  //table component.
  document.querySelector(".container").innerHTML = `
  <table class="table">
    <tbody>
    ${timeSlots.map((timeslot, index) => 
      `<tr id="timeslot-row" scope="row">
      <td class="hour" scope="col">${timeslot.time}</td>
      ${headerCells.slice(1).map(forEachCell => `
        <td key=${forEachCell} class="${setCellBackground(timeslot.hour)}">
          <input 
            name="cell-contents" 
            type="text"
            class="time-block cell-input w-100 h-100 p-2"
            id="${timeslot.time}-cell"
            value="${
              scheduleStorage && 
              getCellContentsById(timeslot.time + "-cell") ? 
              getCellContentsById(timeslot.time + "-cell") : 
              ''
            }"
          ></input>
        </td>
        <td class="saveBtn bg-info">
          <button
            id="${timeslot.time}-button"
            data-time="${timeslot.time}"
            data-index="${index}"
            type="submit" 
            class="btn text-light" 
            onclick="saveContents(event)"
          ><i class="fa fa-lock" aria-hidden="true"></i></button>
        </td>
      `).join("")}
      </tr>
      `
      ).join("")}
      </tbody>
    </table>
    `;
  };
updateScheduleTable();