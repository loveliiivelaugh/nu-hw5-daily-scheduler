const currentDay = document.querySelector("#currentDay");

const handleLocalStorage = (action, storageName, data) => {
  let storage = [];
  switch (action) {
    case "initialize":
      storage = localStorage.getItem(storageName) ? JSON.parse(localStorage.getItem(storageName)) : []
      return storage;
    case "set":
      localStorage.setItem(storageName, JSON.stringify(data));
      break;
    case "get":
      storage = JSON.parse(localStorage.getItem(storageName))
      return storage;
    case "clear":
      localStorage.clear(storageName)
      break;
    default:
      break;
  }
};

//initialize local storage
let scheduleStorage = handleLocalStorage("initialize", "schedule");
const refreshScheduleStorage = () => {
  scheduleStorage = handleLocalStorage("get", "schedule");
};

console.info(scheduleStorage);
// handleLocalStorage("clear", "schedule");
const setCurrentDay = () => { currentDay.innerHTML = moment().format("dddd; MMMM-D-YY"); };

const headerCells = [
  {name:""},
  {name:""},
];

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

const saveContents = (event) => {
  for (i = 0; i < scheduleStorage.length; i++) {
    if (event.target.dataset.time === scheduleStorage[i].cellId.split("-")[0]) {
      scheduleStorage.splice(event.target.dataset.index, 1);
    }
  }
  
  const cellContents = document.getElementById(event.target.dataset.time+"-cell") ?
  document.getElementById(event.target.dataset.time+"-cell").value : '';

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

const getCellContentsById = (id) => {
  for (i = 0; i < scheduleStorage.length; i++) {
    if (id === scheduleStorage[i].cellId) {
      return scheduleStorage[i].cellContents ? scheduleStorage[i].cellContents : '';
    }
  }
};

const setCellBackground = (hour) => {
  if (hour < moment().hour()) { return "table-light" || "past"; }
  else if (hour == moment().hour()) { return "table-danger" || "present"; }
  else if (hour > moment().hour()) { return "table-success" || "future"; }
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