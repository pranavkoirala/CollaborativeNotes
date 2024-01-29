document.addEventListener("DOMContentLoaded", function () {
  const noteEditor = document.getElementById("note-editor");
  const notebookCodeDisplay = document.getElementById("notebook-code");
  const fontSizeDropdown = document.getElementById("font-size-dropdown");

  const urlParams = new URLSearchParams(window.location.search);
  const notebookCode = urlParams.get("code");

  notebookCodeDisplay.textContent = `Notebook Code: ${notebookCode}`;

  const socket = new WebSocket(`ws://localhost:3000/${notebookCode}`);

  socket.addEventListener("open", function () {
    socket.send(JSON.stringify({ type: "requestContent" }));
  });

  socket.addEventListener("message", function (event) {
    const data = JSON.parse(event.data);

    if (data.type === "existingContent") {
      if (noteEditor.innerHTML === "") {
        noteEditor.innerHTML = data.content;
      }
    } else {
      noteEditor.innerHTML = data.content;
    }
  });

  noteEditor.addEventListener("input", function () {
    const content = noteEditor.innerHTML;
    socket.send(JSON.stringify({ type: "contentUpdate", content }));
  });

  document.getElementById("bold-button").addEventListener("click", function () {
    document.execCommand("bold", false, null);
  });

  document
    .getElementById("italic-button")
    .addEventListener("click", function () {
      document.execCommand("italic", false, null);
    });

  document
    .getElementById("underline-button")
    .addEventListener("click", function () {
      document.execCommand("underline", false, null);
    });

  document
    .getElementById("align-left-button")
    .addEventListener("click", function () {
      document.execCommand("justifyLeft", false, null);
    });

  document
    .getElementById("align-center-button")
    .addEventListener("click", function () {
      document.execCommand("justifyCenter", false, null);
    });

  document
    .getElementById("align-right-button")
    .addEventListener("click", function () {
      document.execCommand("justifyRight", false, null);
    });

  document
    .getElementById("increase-font-button")
    .addEventListener("click", function () {
      document.execCommand("fontSize", false, "4");
    });

  document
    .getElementById("decrease-font-button")
    .addEventListener("click", function () {
      document.execCommand("fontSize", false, "2");
    });

  fontSizeDropdown.addEventListener("change", function () {
    document.execCommand("fontSize", false, fontSizeDropdown.value);
  });
});
