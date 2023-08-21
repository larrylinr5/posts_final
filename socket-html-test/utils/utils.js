function isInputHasValue(targetInput) {
  if (targetInput.value !== "") return true;
  return false;
}

function createToast(elementId) {
  const toastEl = document.getElementById(elementId);
  return bootstrap.Toast.getOrCreateInstance(toastEl);
}

function timeToHideToast(time, toast) {
  setTimeout(() => {
    toast.hide();
  }, time);
}
