const qrcode = require("qrcode-terminal");
const { Client } = require("whatsapp-web.js");
const client = new Client();

const text = "this is an automated message - test 2";
let contactList = [];

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");

  requestContacts();
});

client.initialize();

async function requestContacts() {
  const contacts = await client.getContacts();

  contacts.forEach((contact) => {
    if (contact.isMe) {
      contactList.push(contact.id._serialized);
    } else if (contact.name == "Oinc Oinc") {
      contactList.push(contact.id._serialized);
    }
  });

  contactList.forEach((id) => {
    client.sendMessage(id, text);
  });
}
