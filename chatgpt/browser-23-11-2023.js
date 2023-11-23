// Script to export a conversation. Run in browser's developer console while on a `https://chat.openai.com/share/***` url. Will download conversation to a local `.json` file.

// Get share id
function getShareIdFromUrl(url) {
  try {
	const urlObject = new URL(url);
	const pathnameParts = urlObject.pathname.split('/');
	const shareId = pathnameParts[pathnameParts.length - 1];
	return shareId;
  } catch (error) {
	console.error('Error parsing URL:', error);
	return null;
  }
}

// Create conversation placeholder variable
window.convo = {
		id:"",
    title: "",
    date: "",
    messages: []
}

window.convo.id = getShareIdFromUrl(location.href);
// Store title and date
window.convo.title = document.querySelector("h1").innerText
window.convo.date = document.querySelector("div.pt-3.text-base.text-gray-400").innerText

// Traverse all messages
for (const [index, messageElement] of await document.querySelectorAll("[data-message-author-role]").entries()) {
    let message = {
   	 id: messageElement.dataset.messageId,
   	 role: messageElement.dataset.messageAuthorRole,
   	 html: messageElement.querySelector("div").innerHTML,
    }
    // Add message to conversation
    window.convo.messages.push(message)
}

// Print out conversation
console.log(window.convo)

// Download as .json file
window.jsonString = JSON.stringify(window.convo, null, 2)
window.dataString = "data:text/json;charset=utf-8," + encodeURIComponent(window.jsonString);
window.downloadElement = document.createElement('a');
window.downloadElement.setAttribute("href", window.dataString);
window.downloadElement.setAttribute("download", `${window.convo.date} -- ${window.convo.title}.json`);
window.downloadElement.click();
