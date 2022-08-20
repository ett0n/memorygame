import { startTimer, compare, lifePrint, chrono } from "./functions";

const grid: any = document.querySelector("#grid");
const gameScreen: any = document.querySelector("#game-screen");
const endScreen: any = document.querySelector("#end-screen");
const endInfo: any = document.querySelector("#end-infos");
const leaderboard: any = document.querySelector("#leaderboard");

let board: string[] = [];
const symbols = ["🍧", "🥨", "🍗", "☕", "🥪", "🍌", "🍔", "🍕"];
let counterSuccess: number = 0;
let gameInterval: any;
let lifesCnt: number = 0;
let highScores: string = "";
let tableHead: String = "";

//keep selection step to get dataset id of two elements
let selectedEl: HTMLElement[] = [];

[...symbols, ...symbols].forEach((s) => (Math.random() > 0.5 ? board.push(s) : board.unshift(s)));

grid.innerHTML = board.map((i, index) => `<div class="hidden" data-id="${index}">${i}</div>`).join("");

printLeader();

console.log(new Date().toLocaleString());

//begin stopwatch on grid click from ./functions.ts
grid.addEventListener(
  "click",
  function () {
    //starts the timer and set life counter
    gameInterval = setInterval(startTimer, 1000);
    lifesCnt = 4;
    lifePrint(lifesCnt);
  },
  { once: true }
);

grid.addEventListener("click", (e: any) => {
  //don't show elements if waiting for FAILURE cooldown
  if (selectedEl.length !== 2) {
    e.target.classList.remove("hidden");
    e.target.classList.add("selected");
  }
  //if element is DIV except DIV container and not already FOUND
  if (e.target.tagName === "DIV" && e.target.id !== "grid" && !e.target.classList.contains("found")) {
    //one element inside selectedEl
    if (selectedEl.length === 1) {
      //if user clic on same element already shown
      if (selectedEl[0].dataset.id === e.target.dataset.id) {
        return;
        //user clicked on a different element, time to compare
      } else {
        selectedEl.push(e.target);

        //SUCCESS
        if (compare(board, parseInt(selectedEl[0].dataset.id!), parseInt(selectedEl[1].dataset.id!))) {
          lifesCnt++;
          lifePrint(lifesCnt);
          counterSuccess++;
          //CHECK WIN CONDITION
          if (counterSuccess === symbols.length) {
            win();
          }
          selectedEl.forEach((e) => {
            e.classList.add("found");
          });
          selectedEl = [];
        }

        //FAILURE
        else {
          selectedEl.forEach((e) => {
            e.classList.add("error");
          });
          setTimeout(function () {
            selectedEl.forEach((e) => {
              e.classList.remove("error", "selected");
              e.classList.add("hidden");
            });
            selectedEl = [];
            lifesCnt--;
            lifePrint(lifesCnt);
            if (lifesCnt === 0) {
              lose();
            }
            return;
          }, 1000);
        }
      }
    }
    //no element inside selectedEl
    else if (selectedEl.length === 0) {
      selectedEl.push(e.target);
    }
  }
});

function win() {
  clearInterval(gameInterval);
  console.log("gg");
  gameScreen.classList.toggle("active");
  endScreen.classList.toggle("active");
  endInfo.innerHTML = "You won in <strong>" + chrono.textContent + "</strong> s, <br/> and <strong>" + lifesCnt + "</strong> lifes left! <br/> Well done !";
  addLeader();
}

function lose() {
  clearInterval(gameInterval);
  gameScreen.classList.toggle("active");
  endScreen.classList.toggle("active");
  endInfo.innerHTML = "You lost with " + counterSuccess + " correct guessses in " + chrono.textContent + "s";
}

function addLeader() {
  highScores = highScores.replace(
    /^/,
    `<tr>
  <td>${new Date().toLocaleString()}</td>
  <td>${lifesCnt}</td>
  <td>${chrono.textContent}</td>
</tr>`
  );

  localStorage.setItem("scores", JSON.stringify(highScores));
  printLeader();
}

function printLeader() {
  let domLeaderBoard: any = leaderboard.querySelector("#leader-inject");

  //check if localstorage exists
  if (localStorage.getItem("scores") === null) {
    leaderboard.querySelector(".leaderboard-title").classList.add("domhide");
    leaderboard.querySelector(".leaderboard-clear").classList.add("domhide");
  } else {
    leaderboard.querySelector(".leaderboard-title").classList.remove("domhide");
    leaderboard.querySelector(".leaderboard-clear").classList.remove("domhide");
    tableHead = "<th>Attempt Date</th><th>Life</th><th>Time</th>";
  }

  highScores = localStorage.getItem("scores") !== null ? JSON.parse(localStorage.scores) : "";
  let stringScore: String = (tableHead += highScores);
  domLeaderBoard.innerHTML = stringScore;
}

document.querySelector(".leaderboard-clear")?.addEventListener("click", () => {
  localStorage.clear();
  printLeader();
  leaderboard.querySelector("#leader-inject").innerHTML = "";
});
