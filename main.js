const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Client, MessageMedia } = require("whatsapp-web.js");

const app = express();
const port = 3000;
let qrdata;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/submit-message", (req, res) => {
  const message = req.body;

  let contactList = [];
  let imagePath = "./content/image.png";

  const client = new Client();

  client.on("qr", (qr) => {
    console.log(qr);
    qrdata = qr;
  });

  client.on("ready", () => {
    if (message.for === "just-me") {
      testMessage();
    } else if (message.for === "all-contacts") {
      sendMessages();
    }
  });

  client.initialize();

  // gets contact list and sends messages
  async function sendMessages() {
    const contacts = await client.getContacts();

    contacts.forEach((contact) => {
      if (contact.isWAContact && contact.isMyContact) {
        contactList.push(contact.id._serialized);
      }
    });

    contactList.forEach((id) => {
      const image = MessageMedia.fromFilePath(imagePath);
      client.sendMessage(id, image, {
        caption: message.body,
      });
    });
  }

  // sends message to user's own number
  async function testMessage() {
    const contacts = await client.getContacts();

    let myId;

    // get user's own id/number
    contacts.forEach((contact) => {
      if (contact.isMe) {
        myId = contact.id._serialized;
      }
    });

    const image = MessageMedia.fromFilePath(imagePath);

    client.sendMessage(myId, image, {
      caption: message.body,
    });
  }

  res.json({
    message: "Message received by the server!",
  });
});

app.post("/request-qrcode", (req, res) => {
  res.json({
    qr: qrdata,
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
