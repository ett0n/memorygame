import { startTimer, compare } from "./functions";

const grid: any = document.querySelector("#grid");

let board: string[] = [];
const symbols = ["🍧", "🥨", "🍗", "☕", "🥪", "🍌", "🍔", "🍕"];
let counterSuccess: number = 0;
let gameInterval: any;

//keep selection step to get dataset id of two elements
let selectedEl: HTMLElement[] = [];

[...symbols, ...symbols].forEach((s) => (Math.random() > 0.5 ? board.push(s) : board.unshift(s)));

grid.innerHTML = board.map((i, index) => `<div class="hidden" data-id="${index}">${i}</div>`).join("");

//begin stopwatch on grid click from ./functions.ts
grid.addEventListener(
  "click",
  function () {
    gameInterval = setInterval(startTimer, 1000);
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
}
