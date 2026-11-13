document.addEventListener("DOMContentLoaded", () => {
    const baseWords = ["dobro", "romario", "snz", "fur"];
    const separators = ["_", "-"];
    const STORAGE_KEY = "generated_passwords_history";

    const currentPasswordEl = document.getElementById("current-password");
    const historyLogEl = document.getElementById("history-log");
    const btnGenerate = document.getElementById("btn-generate");
    const btnCopy = document.getElementById("btn-copy");
    const btnDownload = document.getElementById("btn-download");
    const btnClear = document.getElementById("btn-clear");

    let lastPassword = "";

    // Load saved history on startup
    loadHistory();

    btnGenerate.addEventListener("click", () => {
        const password = generatePassword();
        lastPassword = password;
        currentPasswordEl.textContent = password;

        const timestamp = getFormattedDateTime();
        const entry = `[${timestamp}] ${password}\n`;

        appendHistory(entry);
    });

    btnCopy.addEventListener("click", () => {
        if (!lastPassword) return;
        navigator.clipboard.writeText(lastPassword).then(() => {
            const originalText = btnCopy.textContent;
            btnCopy.textContent = "Copied!";
            setTimeout(() => {
                btnCopy.textContent = originalText;
            }, 1500);
        });
    });

    btnDownload.addEventListener("click", () => {
        const content = historyLogEl.value;
        if (!content) {
            alert("History is empty. Generate a password first.");
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

    btnClear.addEventListener("click", () => {
        if (confirm("Clear all saved password history?")) {
            localStorage.removeItem(STORAGE_KEY);
            historyLogEl.value = "";
        }
    });

    function generatePassword() {
        // 1. Copy and shuffle words (Fisher-Yates algorithm)
        const words = [...baseWords];
        for (let i = words.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [words[i], words[j]] = [words[j], words[i]];
        }

        // 2. Randomly capitalize the first letter of each word
        const formattedWords = words.map(word => {
            if (Math.random() < 0.5) {
                return word.charAt(0).toUpperCase() + word.slice(1);
            }
            return word;
        });

        // 3. Choose a random separator ('_' or '-')
        const sep = separators[Math.floor(Math.random() * separators.length)];

        // 4. Generate 4 random digits (0000 - 9999)
        const digits = Math.floor(Math.random() * 10000).toString().padStart(4, "0");

        return formattedWords.join(sep) + digits;
    }

    function getFormattedDateTime() {
        const now = new Date();
        const dd = String(now.getDate()).padStart(2, "0");
        const mm = String(now.getMonth() + 1).padStart(2, "0");
        const yy = String(now.getFullYear()).slice(-2);
        const hh = String(now.getHours()).padStart(2, "0");
        const min = String(now.getMinutes()).padStart(2, "0");
        const ss = String(now.getSeconds()).padStart(2, "0");

        return `${dd}.${mm}.${yy}  ${hh}:${min}:${ss}`;
    }

    function loadHistory() {
        const saved = localStorage.getItem(STORAGE_KEY) || "";
        historyLogEl.value = saved;
    }

    function appendHistory(entry) {
        const current = localStorage.getItem(STORAGE_KEY) || "";
        const updated = current + entry;
        localStorage.setItem(STORAGE_KEY, updated);
        historyLogEl.value = updated;
        historyLogEl.scrollTop = historyLogEl.scrollHeight;
    }
});
