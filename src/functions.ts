//Stopwatch
export const chrono: any = document.querySelector("#chrono");
const lifes: any = document.querySelector("#lifecounter");

export let min: number = 0;
export let sec: number = 0;

export function startTimer() {
  if (sec === 59) {
    sec = 0;
    min += 1;
  } else {
    sec++;
  }
  chrono.innerHTML = `${min < 10 ? "0" : ""}${min}:${sec < 10 ? "0" : ""}${sec}`;
}

export function compare(board: string[], el1: number, el2: number) {
  if (board[el1] === board[el2]) {
    return true;
  } else return false;
}

export function lifePrint(lifeCount: number) {
  lifes.innerHTML = "";
  for (let i = 0; i < lifeCount; i++) {
    lifes.innerHTML += "❤️ ";
  }
}
