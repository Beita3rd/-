"use strict";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get( [ "workTime", "blockedSites", "enabled"], local => {
    if (!local.workTime) {
      const workTime = 90; //90min
      chrome.storage.local.set({ workTime });
    }
    if (!local.blockedSites) {
      const blockedSites = ["https://www.youtube.com/", "https://www.netflix.com/"];
      chrome.storage.local.set({ blockedSites });
    }
    if (!local.enabled) {
      const enabled = false;
      chrome.storage.local.set({ enabled });
    }
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const url = changeInfo.pendingUrl || changeInfo.url;
  if (!url || !url.startsWith("http")) {
    return;
  }

  const hostname = new URL(url).hostname;
  console.log(hostname);
  chrome.storage.local.get([ 'blockedSites', 'enabled' ], local => {
    const { blockedSites, enabled } = local;
    if (enabled && blockedSites.find(site => site.includes(hostname))) {
      chrome.tabs.remove(tabId);
    }
  });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  chrome.storage.local.set({ enabled: false });
});

