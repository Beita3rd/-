"use strict";

const selectHour = document.getElementById("select-hour");
const selectMinutes = document.getElementById("select-minutes");
const newBlockSite = document.getElementById("new-block-site");
const blockedList = document.getElementById("blocked-list");
const removeCheckboxes = document.getElementsByClassName("remove-checkbox");
const save = document.getElementById("save");
const remove = document.getElementById("remove");

function addOption (select, selected, optionMaxNumber) {
  for (let i=0; i<=optionMaxNumber; i++) {
    const isSelected = (selected === i) ? "selected" : "";
    const text = `<option value="${i}" ${isSelected}>${i}</option>`
    select.insertAdjacentHTML('beforeend', text);
  }
}

function convertHourMinutes (time) {
  let hour, minutes;
  if (time >= 60) {
    hour = Math.floor(time/60);
    minutes = time - 60 * hour;
  } else {
    hour = 0;
    minutes = time;
  }
  let hourMinutes = new Map ([['hour', hour], ['minutes', minutes]]);
  return hourMinutes;
}

function convertMinutes (hour, minutes) {
   const workTime = hour * 60 + minutes;
   return workTime;
}

function showBlockedLists (blockedSites) {
  blockedSites.forEach(site => {
    const text = `<p><input type="checkbox" value="${site}" class="remove-checkbox"/>${site}</p>`
    blockedList.insertAdjacentHTML('afterbegin', text);
  });
}

function isChcked () {
  let checkdList = []
  for (let i=0; i<removeCheckboxes.length; i++){
    if (removeCheckboxes[i].checked) {
      checkdList.push(removeCheckboxes[i].value);
    }
  }
  return checkdList;
}

function removeBlockedSites(checkdList) {
  chrome.storage.local.get("blockedSites", ({blockedSites}) => {
    blockedSites = blockedSites.filter(site => {
      if (!checkdList.includes(site)) {
        return site;
      }
    });
    console.log(blockedSites);
    chrome.storage.local.set({ blockedSites });
  });
}





// 保存
save.addEventListener("click", () => {
  const hour = Number(selectHour.value);
  const minutes = Number(selectMinutes.value);
  const workTime = convertMinutes(hour, minutes);
  const site = newBlockSite.value;
  chrome.storage.local.set({ workTime });
  if (site != "") {
    chrome.storage.local.get("blockedSites", ({blockedSites}) => {
      blockedSites.push(site);
      chrome.storage.local.set({ blockedSites });
    });
  }
});

// 削除
remove.addEventListener("click", () => {
  const checkdList = isChcked();
  removeBlockedSites(checkdList);
});

// 表示
window.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get([ 'workTime', 'blockedSites'], local => {
    const { workTime, blockedSites } = local;
  
    const hourMinutes = convertHourMinutes(workTime);
    addOption(selectHour, hourMinutes.get('hour'), 9);
    addOption(selectMinutes, hourMinutes.get('minutes'), 59);
  
    showBlockedLists(blockedSites);
  });
});










