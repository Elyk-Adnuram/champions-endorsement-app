//initialize firebase app
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
//import firebase functions
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

//import firebase database url
const appSettings = {
  databaseURL: "",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const championsDB = ref(database, "champions");

const textArea = document.getElementById("textarea");

const publishBtn = document.getElementById("publish-Btn");
let endorsementsContainer = document.getElementById("endorsements");

publishBtn.addEventListener("click", () => {
  let inputValue = textArea.value;
  if (inputValue == "") {
    alert("Please enter an endorsement to proceed");
  } else {
    //when pushing data to DB, two parameters are used, the refererce to the DB and the data to be added or "pushed"
    push(championsDB, inputValue);

    clearInput();
  }
});

onValue(championsDB, function (snapshot) {
  if (snapshot.exists()) {
    //snapshot object is converted to an array
    let endorsementsArray = Object.entries(snapshot.val());

    clearEndorsements();
    //loop through snapshot array and add each item(endorsement) in array to html page
    endorsementsArray.forEach((item) => {
      //run the below function with item as the argument
      addEndorsement(item);
    });
  } else {
    endorsementsContainer.innerHTML = "No endorsements added yet";
  }
});

//clear the text area of user input
function clearInput() {
  textArea.value = "";
}

//clear the endorsement container on html page
function clearEndorsements() {
  endorsementsContainer.innerHTML = "";
}

//add an endorsement to the html page
function addEndorsement(item) {
  //unique ID of each item added to the DB, used to remove item/delete item
  let itemID = item[0];
  //value of each item added to the DB
  let itemValue = item[1];
  //create a paragraph tag
  let newEndorsement = document.createElement("p");

  newEndorsement.textContent = itemValue;
  newEndorsement.addEventListener("click", function () {
    let exactLocationOfItemInDB = ref(database, `/champions/${itemID}`);
    remove(exactLocationOfItemInDB);
  });

  endorsementsContainer.appendChild(newEndorsement);
}
