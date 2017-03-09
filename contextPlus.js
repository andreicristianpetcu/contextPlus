browser.contextualIdentities.query({})
  .then((contexts) => {
    const parentId = chrome.contextMenus.create({
      id: "moveContext",
      title: "Move to context",
      contexts: ["tab"]
    });

    const contextStore = contexts.reduce((store, context) => {
      return Object.assign({}, store, {
        [`contextPlus-${context.name}`]: context.cookieStoreId
      });
    }, {});

    contexts.forEach(context => {
      chrome.contextMenus.create({
        type: "normal",
        title: context.name,
        id: `contextPlus-${context.name}`,
        parentId
      });
    });

    browser.contextMenus.onClicked.addListener(function (info, tab) {
      if (contextStore.hasOwnProperty(info.menuItemId)) {
        const cookieStoreId = contextStore[info.menuItemId];
        const newTabData = {
          active,
          index,
          pinned,
          url,
          windowId
        } = tab;

        browser.tabs.create({
          active,
          cookieStoreId,
          index,
          pinned,
          url,
          windowId
        }).then(() => browser.tabs.remove(tab.id));
      }
    });
  });