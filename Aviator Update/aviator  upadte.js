const TelegramBot = require("node-telegram-bot-api");
const moment = require("moment");
const momentTimezone = require("moment-timezone");

const token = "7055360286:AAGEn1oM5jRhsslCCc2OO73froXzT33FqBs"; // Replace with your Telegram Bot token
const bot = new TelegramBot(token, { polling: true });

let isSignalProcessing = false;

// Signal Generation with Confidence Logic
function generateSignal() {
  const multiplier = (Math.random() * (3.0 - 1.5) + 1.5).toFixed(2); // Multiplier range (1.5x to 3x)
  const exitTimeLocal = moment().add(60, "seconds").format("HH:mm:ss"); // Exit time in local timezone
  const exitTimeGST = momentTimezone()
    .tz("Asia/Dubai")
    .add(60, "seconds")
    .format("HH:mm:ss"); // Exit time in GST
  const exitTimeIST = momentTimezone()
    .tz("Asia/Kolkata")
    .add(60, "seconds")
    .format("HH:mm:ss"); // Exit time in IST

  const confidenceLevel = (Math.random() * (1 - 0.7) + 0.7).toFixed(2); // Confidence level between 70% to 100%
  const signalStrength =
    confidenceLevel >= 0.9
      ? "Strong"
      : confidenceLevel >= 0.8
        ? "Moderate"
        : "Weak"; // Signal strength

  return {
    isWin: true, // For simplicity, assuming the signal is always a win
    multiplier,
    exitTimeLocal,
    exitTimeGST,
    exitTimeIST,
    confidenceLevel,
    signalStrength,
  };
}

// Check the time until the next round start and notify users
function checkRoundStart() {
  const roundStartTime = moment().add(1, "minute"); // Example: Next round start time is 1 minute from now
  const currentTime = moment();

  const timeDifference = roundStartTime.diff(currentTime, "seconds");
  const notifyBeforeStart = 10; // Notify 10 seconds before round start

  if (timeDifference <= notifyBeforeStart && timeDifference > 0) {
    // Send notification that the round is starting soon
    sendRoundStartNotification(timeDifference);
  }

  // Check again in 1 second
  setTimeout(checkRoundStart, 1000);
}

function sendRoundStartNotification(timeDifference) {
  bot.sendMessage(
    "YOUR_CHAT_ID", // Replace with the actual chat ID dynamically extracted
    `🚨 The next round is starting in ${timeDifference} seconds! Get ready! 🚨`
  );
}

// Bot Commands and Game Flow
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id; // Get chat ID dynamically from the message
  bot.sendMessage(
    chatId,
    "Welcome to the Aviator Betting Bot! Press 'Get Signal' to get a betting signal or /evaluate to evaluate a math expression.",
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Get Signal", callback_data: "get_signal" }],
        ],
      },
    },
  );
});

// Button logic for "Get Signal"
bot.on("callback_query", async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id; // Get chat ID dynamically from the callback query
  const data = callbackQuery.data;

  if (data === "get_signal" || data === "next_signal") {
    await sendSignal(chatId);
  }
});

async function sendSignal(chatId) {
  if (isSignalProcessing) return; // Prevent multiple signals being generated at once
  isSignalProcessing = true;

  // Send a waiting message while the signal is being generated
  const waitingMessage = await bot.sendMessage(
    chatId,
    "⏳ Please wait a few moments while we generate the signal...",
  );

  const delayInMillis =
    Math.floor(Math.random() * (130 - 110 + 1) + 110) * 1000; // Random delay between 110s and 130s

  setTimeout(async () => {
    await bot.sendMessage(chatId, "🔐 Analyzing game data...");

    const signalData = generateSignal(); // Generate the signal
    const {
      isWin,
      multiplier,
      exitTimeLocal,
      exitTimeGST,
      exitTimeIST,
      confidenceLevel,
      signalStrength,
    } = signalData;
    const safeCashOut = (multiplier * 0.7).toFixed(2); // Safe cash-out multiplier (70% of the original multiplier)
    const resultMessage = isWin ? "✅ <b>WIN</b> ✅" : "❌ <b>LOSS</b> ❌"; // Result of the signal (win or loss)

    // Send the generated signal to the user
    await bot.sendMessage(
      chatId,
      `${resultMessage}\n💰 Exit at ${multiplier}x\nBet in ${exitTimeIST} (IST) / ${exitTimeGST} (GST)! ✅\nAuto cash-out at ${safeCashOut}x\nConfidence Level: ${confidenceLevel} (${signalStrength})`,
      { parse_mode: "HTML" },
    );

    // After sending the signal, offer the user the option to get the next signal
    setTimeout(() => {
      bot.sendMessage(
        chatId,
        `Press 'Get Next Signal' to receive another signal.`,
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: "Get Next Signal ✅", callback_data: "next_signal" }],
            ],
          },
        },
      );
      isSignalProcessing = false;
    }, delayInMillis);
  }, delayInMillis);
}

// Example Functions to Simulate Other Code Blocks
function arrayExample(chatId) {
  let a = [1, 2, 3, 4];
  let s = ["hello", "world", "aviator"];

  let result = `Array a: ${a.join(", ")}\nType of a: ${typeof a}\nCount of a: ${a.length}\n\nArray s: ${s.join(", ")}\n`;

  let b = new Array(3); // Create array of size 3
  result += `Before assignment (b): ${b.join(", ")}\n`;

  for (let i = 0; i < 3; i++) {
    b[i] = i; // Assign values to array
  }

  result += `After assignment (b): ${b.join(", ")}\n`;

  // Create a 2D array (multidimensional array)
  let c = [];
  let x = 0;
  for (let i = 0; i < 3; i++) {
    c[i] = [];
    for (let j = 0; j < 2; j++) {
      c[i][j] = x;
      x++;
    }
  }

  result += "\nMultidimensional array c:\n";
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 2; j++) {
      result += `c[${i}][${j}] = ${c[i][j]}\n`;
    }
  }

  bot.sendMessage(chatId, result);
}

// Handle math evaluation
function functionExample(chatId) {
  // Add function example
  function add(x, y) {
    return x + y;
  }

  // Calling add function with numbers
  let three = add(1, 2);
  let result = `Result of add(1, 2): ${three}\n`;

  // Calling add function with strings
  let s = add("hello", " world");
  result += `Result of add('hello', ' world'): ${s}\n`;

  bot.sendMessage(chatId, result);
}

// Handling Commands
bot.onText(/\/arrays/, (msg) => {
  const chatId = msg.chat.id; // Get chat ID dynamically from the message
  arrayExample(chatId);
});

bot.onText(/\/function/, (msg) => {
  const chatId = msg.chat.id; // Get chat ID dynamically from the message
  functionExample(chatId);
});

// Evaluate command for mathematical expression evaluation
bot.onText(/\/evaluate (.+)/, (msg, match) => {
  const chatId = msg.chat.id; // Get chat ID dynamically from the message
  const expression = match[1];

  const result = calculate(expression);
  bot.sendMessage(chatId, `Result: ${result}`);
});

// Calculation logic
function calculate(s) {
  const stack = [];
  const tokens = parse(s);

  for (const token of tokens) {
    if (token.type === "NUMBER") {
      stack.push(token.val);
    } else if (token.type === "OP") {
      const b = stack.pop();
      const a = stack.pop();

      switch (token.val) {
        case "+":
          stack.push(a + b);
          break;
        case "-":
          stack.push(a - b);
          break;
        case "*":
          stack.push(a * b);
          break;
        case "/":
          stack.push(a / b);
          break;
        default:
          return NaN;
      }
    }
  }

  return stack.pop();
}

function parse(s) {
  const regex = /\d+(\.\d+)?|\+|\-|\*|\//g;
  const tokens = [];
  let match;

  while ((match = regex.exec(s)) !== null) {
    tokens.push({
      type: isNaN(match[0]) ? "OP" : "NUMBER",
      val: match[0],
    });
  }

  return tokens;
}