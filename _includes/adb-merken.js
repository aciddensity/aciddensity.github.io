var detectMissingAdBlock = (fn) => {
  if (document.readyState != "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
};

detectMissingAdBlock(() => {
  var cookieNameValue = "ftf-dma-notice=shown";
  var note = document.getElementById("ftf-dma-note");
  var noteCloseButton = document.getElementById("ftf-dma-close-btn");

  if (note !== null && noteCloseButton !== null) {
    noteCloseButton.onclick = (ev) => {
      console.log("added onclick  d-none");
      note.classList.add("d-none");
      document.cookie = cookieNameValue + ";path=/";
    };
  }

  if (document.cookie.indexOf(cookieNameValue) === -1) {
    if (note !== null) {
      note.classList.remove("d-none");
    }
  }
});