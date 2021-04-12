"use strict";

const toggle = document.getElementById("enable-toggle");
const remainingTimer = document.getElementById("remaining-timer");

chrome.storage.local.get("enabled", ({enabled}) => {
  toggle.checked = enabled;
  if (enabled) {
    toggle.disabled = "disabled"
    remainingTime();
  }
});

toggle.addEventListener("change", (event) => {
  const enabled = toggle.checked;
  chrome.storage.local.set({ enabled: enabled });
  createWorkTimer(enabled);
});

function createWorkTimer (enabled) {
  if (enabled) {
    toggle.disabled = (enabled) ? "disabled" : "";
    chrome.storage.local.get("workTime", ({workTime}) => {
      const delayInMinutes = workTime;
      chrome.alarms.create({delayInMinutes});
      remainingTime();
    });
  }
}

function remainingTime () {
  chrome.alarms.get(alarm => {
    const unixtime = alarm.scheduledTime;
    const date = new Date(unixtime);
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const text = `<h2>${hour}時${minutes}分まで</h2>`
    remainingTimer.insertAdjacentHTML('beforeend', text);
  });
}


