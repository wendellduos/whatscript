const fs = require("node:fs");
const qrcode = require("qrcode-terminal");
const { Client, MessageMedia } = require("whatsapp-web.js");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let contactList = [];
let imagePath = "./content/image.png";
const captionPath = "./content/caption.txt";
let caption;

// read text from caption.txt file
fs.readFile(captionPath, "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  caption = data;
});

// create new client and log qr code
const client = new Client();

client.on("qr", (qr) => {
  console.clear();
  qrcode.generate(qr, { small: true });
});

// when ready, says so and asks for user confirmation on message to send
client.on("ready", () => {
  console.log("Login efetuado!\n\n");
  console.warn(
    "A imagem [image.png] será enviada à todos os seus contatos, com a seguinte legenda:\n"
  );
  console.log(`${caption}\n`);

  rl.question("Deseja prosseguir? [S/n/teste]", (answer) => {
    const userChoice = answer.toLowerCase();

    if (userChoice === "n") {
      console.log("A execução foi cancelada pelo usuário.");
      process.exit();
    } else if (userChoice === "teste") {
      testMessage();
    } else {
      sendMessages();
    }
  });
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
      caption: caption,
    });
  });

  console.log(
    "\n\nEm processo.\n\nPressione Ctrl+C para finalizar a execução APÓS a conclusão dos envios."
  );
}

// sends message to user's own number
async function testMessage() {
  console.log("A mensagem será enviada somente ao seu próprio número.");

  const contacts = await client.getContacts();
  let myId;

  contacts.forEach((contact) => {
    if (contact.isMe) {
      myId = contact.id._serialized;
    }
  });

  const image = MessageMedia.fromFilePath(imagePath);
  client.sendMessage(myId, image, {
    caption: caption,
  });

  console.log(
    "\n\nEm processo.\n\nPressione Ctrl+C para finalizar a execução APÓS a conclusão do envio."
  );
}
