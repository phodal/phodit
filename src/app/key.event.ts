document.onkeydown = function(event: any) {
  event = event || window.event;
  let isEscape = false;
  if ("key" in event) {
    isEscape = (event.key == "Escape" || event.key == "Esc");
  } else {
    isEscape = (event.keyCode == 27);
  }
  if (isEscape) {
    document.querySelector('interact-bar').setAttribute('style', "display: none;");

    document.getElementById('terminal-section').setAttribute('style', "display: none;");
  }
};
