const baseWords = ["dobro", "romario", "snz", "fur"];
const STORAGE_KEY = "generated_passwords_history";

const passwordDisplay = document.getElementById("passwordDisplay");
const historyDisplay = document.getElementById("historyDisplay");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");
const clearBtn = document.getElementById("clearBtn");

let currentPassword = "";

function getHistory() {
    return localStorage.getItem(STORAGE_KEY) || "";
}

function updateHistoryView() {
    const history = getHistory();
    historyDisplay.textContent = history ? history : "No passwords generated yet.";
}

function formatDateTime(date) {
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yy = String(date.getFullYear()).slice(-2);
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return `${dd}.${mm}.${yy}  ${hh}:${min}`;
}

function generatePassword() {
    // 1. Copy and shuffle array (Fisher-Yates)
    const words = [...baseWords];
    for (let i = words.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [words[i], words[j]] = [words[j], words[i]];
    }

    // 2. Random first-letter capitalization
    const casedWords = words.map(word => {
        if (Math.random() < 0.5) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }
        return word;
    });

    // 3. Random separator ('_' or '-')
    const sep = Math.random() < 0.5 ? "_" : "-";

    // 4. 4 random digits (0000 - 9999)
    const digits = String(Math.floor(Math.random() * 10000)).padStart(4, "0");

    return casedWords.join(sep) + digits;
}

generateBtn.addEventListener("click", () => {
    currentPassword = generatePassword();
    passwordDisplay.textContent = currentPassword;

    const timestamp = formatDateTime(new Date());
    const newEntry = `[${timestamp}] ${currentPassword}\n`;

    const updatedHistory = getHistory() + newEntry;
    localStorage.setItem(STORAGE_KEY, updatedHistory);
    updateHistoryView();
});

copyBtn.addEventListener("click", () => {
    if (!currentPassword) return;
    navigator.clipboard.writeText(currentPassword).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = "Copied!";
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 1200);
    });
});

downloadBtn.addEventListener("click", () => {
    const history = getHistory();
    if (!history) {
        alert("History is empty. Generate a password first.");
        return;
    }

    const blob = new Blob([history], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "passwords.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
});

clearBtn.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    currentPassword = "";
    passwordDisplay.textContent = "Click Generate";
    updateHistoryView();
});

// Initialize view on load
updateHistoryView();
