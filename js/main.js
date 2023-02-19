

const axios = require('axios');

const changes = [];
const rootElementId = 'content';

(function() {
  fetchSimpleHtml().then(html => {
    updateRootElementWithHtml(html);
    changes.push(html);
  });
})();

window.Undo = function Undo() {
  if (changes.length > 1) {
    changes.pop();
    updateRootElementWithHtml(changes[changes.length - 1]);
  }
}

window.UpdateWebsite = function UpdateWebsite() {
  const input = document.querySelector('.chat-footer input[type="text"]');
  const message = input.value;

  console.log(`New message: ${message}`);
  requestCompletion(message).then((responseText) => {
    console.log('responseText', responseText);
    updateRootElementWithHtml(responseText);
    input.value = '';
  })
  // Your custom function code goes here
}

function requestCompletion(prompt) {
  const url = 'http://localhost:3000/predict';
  const data = {
    code: getCurrentRootHtml(),
    request: prompt,
  };

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(response => {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let data = '';
    return reader.read().then(function processResult(result) {
      if (result.done) {
        return data;
      }
      const chunk = decoder.decode(result.value, {stream: true});
      data += chunk;
      return reader.read().then(processResult);
    });
  }).catch(error => {
    console.error('Error fetching data:', error);
  });
}

function fetchSimpleHtml() {
  return fetch('simple_html.html')
    .then(response => response.text())
    .catch(error => console.log(error));
}

function updateRootElementWithHtml(html) {
  const rootDiv = document.getElementById(rootElementId);
  changes.push(html);
  rootDiv.innerHTML = html;
}

function getCurrentRootHtml() {
  const rootDiv = document.getElementById(rootElementId);
  return rootDiv.innerHTML;
}
