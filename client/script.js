const mode = document.getElementById("mode");
const messageBody = document.getElementById("message");
const imageField = document.getElementById("image");

const qrField = document.getElementById("qr");
const qrMask = document.getElementById("qr-mask");

// clear image input field to avoid false positives when sending message
imageField.value = null;

// update name of file selector to selected image's name
const imageTitleField = document.getElementById("image-title");

imageField.addEventListener("change", () => {
  imageTitleField.innerHTML = imageField.files[0].name;
});

// trigger events on PROSSEGUIR button click
document.getElementById("submit-form").addEventListener("click", () => {
  // const messageHasImage = imageField.files.length > 0;

  const message = {
    for: mode.value,
    body: messageBody.value,
    // image: () => {
    // if (messageHasImage) {
    //   new FormData().append("image", imageField.files[0]);
    // }
    // },
  };

  fetch("http://localhost:3000/submit-message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message);
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error sending texts. Please try again.");
    });
});

generateQrCode(`https://www.youtube.com/watch?v=dQw4w9WgXcQ`);

setInterval(() => {
  fetch("http://localhost:3000/request-qrcode", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.qr) {
        qrField.innerHTML = "";
        qrMask.style.display = "none";

        generateQrCode(data.qr);
      }
    })
    .catch((error) => {
      console.error("Error fetching qr-code:", error);
    });
}, 10000);

function generateQrCode(url) {
  new QRCode(qrField, {
    text: url,
    width: 264,
    height: 264,
    colorDark: "#132f31",
    colorLight: "#fff",
    correctLevel: QRCode.CorrectLevel.H,
  });
}
