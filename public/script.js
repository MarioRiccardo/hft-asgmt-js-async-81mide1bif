/// THIS IS FOR AUTOMATED TESTING
if (typeof module !== 'undefined') {
  global.$ = require('jquery')
}
// END

$( document ).ready((() => {
  // DOMContent is laoded, now we can start checking HTML Elements
  // If we dont "wait" for document to be ready, we cannot access HTML elements
  // for testing purposes, you can use a "debugger;" statement or also "console.log(element)"
  console.log('DOM is ready!')

  getData(); // TODO: Implement getData Method
  const input = $('#hft-shoutbox-form-input-name')
  const textarea = $('#hft-shoutbox-form-textarea')

  $('#hft-shoutbox-form').on('keyup', (event) => {
    if (formElementIsValid(input.val(), 3) && formElementIsValid(textarea.val(), 10)) {
      toggleAlertBox(false)
      toggleSubmit(false)
    } else {
      toggleAlertBox(true)
      toggleSubmit(true)
    }
  })

  $("#hft-shoutbox-form").on("submit",  async (e) => {
    e.preventDefault();
    await saveData(input.val(), textarea.val());
  })
}))

function formElementIsValid(element, minLength) {
  return element.length >= minLength
}

function toggleAlertBox(show) {
  const alertEl = $('#hft-shoutbox-alert')

  if (show) {
    alertEl.removeClass('d-none')
  } else {
    alertEl.addClass('d-none')
  }
}

function toggleSubmit(disable) {
  const submitButton = $('#hft-shoutbox-form-submit')
  submitButton.prop('disabled', disable)
}

async function getData() {
  const response = await fetch('/api/shouts');
  const fetchedShouts = await response.json()
  fetchedShouts.map(shout => addTableEntity(shout))
}


async function saveData(username, message) {
  const body = JSON.stringify({username, message})
  const response = await fetch('/api/shouts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body
  });
  addTableEntity(await response.json());
}

// THIS IS FOR AUTOMATED TESTING
if (typeof module !== 'undefined') {
  module.exports = {
    getData,
    saveData
  }
}

const addTableEntity = savedShout => $(".shout-table").append(`<tr><td>${savedShout.id}</td><td>${savedShout.username}</td><td>${savedShout.message}</td></tr>`)
// END
