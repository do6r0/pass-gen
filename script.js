const BASE_WORDS = ["dobro", "romario", "snz", "fur"];
const STORAGE_KEY = "generated_passwords_history";

const passwordDisplay = document.getElementById("passwordDisplay");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");
const clearBtn = document.getElementById("clearBtn");
const historyBox = document.getElementById("historyBox");

let currentPassword = "";

function loadHistory() {
    const saved = localStorage.getItem(STORAGE_KEY) || "";
    historyBox.value = saved;
    historyBox.scrollTop = historyBox.scrollHeight;
}

function getFormattedDateTime() {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yy = String(now.getFullYear()).slice(-2);
    const HH = String(now.getHours()).padStart(2, "0");
    const MM = String(now.getMinutes()).padStart(2, "0");
    const SS = String(now.getSeconds()).padStart(2, "0");
    return `${dd}.${mm}.${yy}  ${HH}:${MM}:${SS}`;
}

function generatePassword() {
    const words = [...BASE_WORDS];

    // Fisher-Yates shuffle
    for (let i = words.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [words[i], words[j]] = [words[j], words[i]];
    }

    // Random capitalization of the first letter
    const casedWords = words.map(word => {
        if (Math.random() < 0.5) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }
        return word;
    });

    // Random separator ('_' or '-')
    const sep = Math.random() < 0.5 ? "_" : "-";

    // 4 random digits (0000 - 9999)
    const digits = String(Math.floor(Math.random() * 10000)).padStart(4, "0");

    return casedWords.join(sep) + digits;
}

generateBtn.addEventListener("click", () => {
    currentPassword = generatePassword();
    passwordDisplay.textContent = currentPassword;

    const timestamp = getFormattedDateTime();
    const entry = `[${timestamp}] ${currentPassword}\n`;

    const existing = localStorage.getItem(STORAGE_KEY) || "";
    const updated = existing + entry;
    localStorage.setItem(STORAGE_KEY, updated);

    loadHistory();
});

copyBtn.addEventListener("click", async () => {
    if (!currentPassword) return;
    try {
        await navigator.clipboard.writeText(currentPassword);
        const originalText = copyBtn.textContent;
        copyBtn.textContent = "Copied!";
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 1200);
    } catch (err) {
        alert("Failed to copy password.");
    }
});

downloadBtn.addEventListener("click", () => {
    const content = localStorage.getItem(STORAGE_KEY) || "";
    if (!content) {
        alert("No passwords to download yet.");
        return;
    }
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "passwords.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

clearBtn.addEventListener("click", () => {
    if (confirm("Clear all saved passwords from browser storage?")) {
        localStorage.removeItem(STORAGE_KEY);
        loadHistory();
    }
});

loadHistory();
