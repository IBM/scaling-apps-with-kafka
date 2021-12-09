let inputDOM = document.getElementById('webhookInput');
let editButtonDOM = document.getElementById('editWebhook');
let saveButtonDOM = document.getElementById('saveWebhook');

editButtonDOM.hidden = true;
saveButtonDOM.hidden = true;

function showWebhook(container, webhook) {
  if (webhook == "Kitchen not found.") {
      container.placeholder = "No webhook set for this kitchen.";
      container.disabled = false;
  } else {
      container.value = webhook;
      editButtonDOM.hidden = false;
  }
}

dropdownDOM.addEventListener("change", async () => {
  inputDOM.disabled = true;
  editButtonDOM.hidden = true;
  saveButtonDOM.hidden = true;
  
  inputDOM.placeholder = 'Fetching webhook...';
  inputDOM.value = '';
  let kitchenID = dropdownDOM.children[dropdownDOM.selectedIndex].value;

  let currentWebhook = await getCurrentWebhook(kitchenID);
  showWebhook(inputDOM, currentWebhook);
});

inputDOM.addEventListener("input", () => {
  if (inputDOM.value == "") {
    saveButtonDOM.hidden = true;
  } else {
    saveButtonDOM.hidden = false;
  }
});

editButtonDOM.addEventListener("click", () => {
  editButtonDOM.hidden = true;
  saveButtonDOM.hidden = false;
  inputDOM.disabled = false;
});

saveButtonDOM.addEventListener("click", async () => {
  let kitchenID = dropdownDOM.children[dropdownDOM.selectedIndex].value;
  saveButtonDOM.hidden = true;
  let response = await saveWebhook(kitchenID, inputDOM.value);
  
  if (response == "OK") {
    inputDOM.disabled = true;
    editButtonDOM.hidden = false;
  } else {
    inputDOM.placeholder = "Failed to save webhook. Please check logs."
  }
});
