const firebaseConfig = {
  apiKey: "AIzaSyAl8eI-_8Ew9va0KPV8p4D2hc9WUTGiwuI",
  authDomain: "chat-d647c.firebaseapp.com",
  databaseURL: "https://chat-d647c-default-rtdb.firebaseio.com",
  projectId: "chat-d647c",
  storageBucket: "chat-d647c.firebasestorage.app",
  messagingSenderId: "1001806177737",
  appId: "1:1001806177737:web:7248a0983dcf0d45a87418"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const chatBox = document.getElementById("chat-box");

function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (!message) return;

  addMessage("user", message);
  input.value = "";

  respondToMessage(message);
}

function addMessage(sender, text) {
  const msg = document.createElement("div");
  msg.className = "message " + sender;
  msg.innerText = (sender === "user" ? "You: " : "Gab Genius: ") + text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function respondToMessage(userMessage) {
  const userMsgLower = userMessage.toLowerCase();

  db.ref("qna").once("value", snapshot => {
    const data = snapshot.val();
    let found = false;

    for (let key in data) {
      const stored = data[key];
      if (stored.question.toLowerCase() === userMsgLower) {
        addMessage("bot", stored.answer);
        found = true;
        break;
      }
    }

    if (!found) {
      addMessage("bot", "Sorry, I don't know that yet. My admin will teach me soon.");
      db.ref("unanswered").push({ question: userMessage, time: new Date().toISOString() });
    }
  });
}
