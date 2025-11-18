// Variables - menggunakan const dan let
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const quickSuggestions = document.getElementById('quickSuggestions');
const themeToggle = document.getElementById('themeToggle');
let messageCount = 0;
let isLoading = false;

// ⚠️ GANTI API KEY INI DENGAN YANG BARU!
const GEMINI_API_KEY = 'AIzaSyCPoMoosRbfEdrusWTjCEqyTGJCsQaZWbY';
// const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;


// System prompt untuk memberikan konteks filosofi Yunani
const SYSTEM_PROMPT = `Jawablah dalam format plain text saja. 
                        Jangan gunakan markdown, bold, italic, heading, bullet, atau karakter khusus apa pun.
                        Hanya teks biasa, dan berikan jawaban max 100 kata.`;

// Jawab hanya dalam plain text.
// Jangan gunakan:
// - bold (**)
// - italic (* or _)
// - heading (#)
// - bullet list (- or *)
// - code block (``` or `)
// - karakter markdown lainnya.

// Jika ada penjelasan atau daftar, tetap tulis semua dalam kalimat biasa tanpa format khusus. Hanya teks standar.


// const SYSTEM_PROMPT = `Kamu adalah chatbot ahli filosofi Yunani kuno yang ramah dan penuh pengetahuan. 

// Karaktermu:
// - Berpengetahuan luas tentang Socrates, Plato, Aristoteles, dan filosof Yunani lainnya
// - Menjelaskan dengan bahasa yang mudah dipahami tapi tetap akurat
// - Sering menggunakan kutipan atau contoh dari filosof Yunani
// - Kadang menyapa dengan bahasa Yunani seperti "Χαίρετε (Chairete)" untuk salam
// - Antusias membahas mitologi Yunani, dewa-dewa Olympus, dan sejarah Athena
// - Menghubungkan filosofi kuno dengan kehidupan modern

// Topik yang kamu kuasai:
// - Filosofi Yunani (metafisika, epistemologi, etika, logika)
// - Tokoh: Socrates, Plato, Aristoteles, Pre-Socratic philosophers
// - Mitologi: Zeus, 12 Dewa Olympus, pahlawan Yunani
// - Sejarah: Athena, Sparta, Alexander Agung
// - Konsep: Teori Bentuk Plato, Golden Mean Aristoteles, Metode Sokrates

// Gaya bicara: Hangat, mendidik, kadang filosofis, tapi tetap mudah dipahami.`;

// Function untuk mendapatkan waktu saat ini
function getCurrentTime() {
    const now = new Date();
    return now.getHours().toString().padStart(2, '0') + ':' + 
           now.getMinutes().toString().padStart(2, '0');
}

// Function untuk menambahkan pesan ke chat
function addMessage(text, isUser) {
    messageCount++;
    const messageDiv = document.createElement('div');
    messageDiv.className = isUser ? 'message user-message' : 'message bot-message';
    
    // DOM Manipulation - membuat struktur pesan
    if (isUser) {
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${text}</p>
                <span class="message-time">${getCurrentTime()}</span>
            </div>
            <div class="message-avatar user-avatar">Anda</div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-avatar">Α</div>
            <div class="message-content">
                <p>${text}</p>
                <span class="message-time">${getCurrentTime()}</span>
            </div>
        `;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function untuk menambahkan loading indicator
function addLoadingMessage() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message bot-message';
    loadingDiv.id = 'loading-message';
    loadingDiv.innerHTML = `
        <div class="message-avatar">Α</div>
        <div class="message-content">
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function untuk menghapus loading indicator
function removeLoadingMessage() {
    const loadingMsg = document.getElementById('loading-message');
    if (loadingMsg) {
        loadingMsg.remove();
    }
}

// Function untuk memanggil Gemini AI API
async function callGeminiAPI(userMessage) {
    try {
        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `${SYSTEM_PROMPT}\n\nUser: ${userMessage}\n\nAssistant:`
                    }]
                }],
                generationConfig: {
                    temperature: 0.9,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 2048,
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text;
        } else {
            throw new Error('Invalid response format from API');
        }
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        return `Maaf, terjadi kesalahan saat menghubungi Gemini AI. 
        
Error: ${error.message}

Pastikan:
1. API key valid dan aktif
2. Koneksi internet stabil
3. Quota API belum habis

Silakan coba lagi atau periksa console untuk detail error. 🏛️`;
    }
}

// Function untuk mendapatkan respons bot dari Gemini AI
async function getBotResponse(userMessage) {
    const response = await callGeminiAPI(userMessage);
    return response;
}

// Function untuk mengirim pesan
async function handleSendMessage() {
    const message = chatInput.value.trim();
    
    // If-else untuk validasi input
    if (message === '' || isLoading) {
        return;
    }
    
    // Set loading state
    isLoading = true;
    sendBtn.disabled = true;
    chatInput.disabled = true;
    
    // Menambahkan pesan user
    addMessage(message, true);
    chatInput.value = '';
    
    // Tampilkan loading indicator
    addLoadingMessage();
    
    try {
        // Panggil Gemini API
        const response = await getBotResponse(message);
        
        // Hapus loading indicator
        removeLoadingMessage();
        
        // Tambahkan respons bot
        addMessage(response, false);
    } catch (error) {
        removeLoadingMessage();
        addMessage('Maaf, terjadi kesalahan. Silakan coba lagi.', false);
    } finally {
        // Reset loading state
        isLoading = false;
        sendBtn.disabled = false;
        chatInput.disabled = false;
        chatInput.focus();
    }
}

// Function untuk toggle dark mode
function toggleDarkMode() {
    // DOM Manipulation - toggle class dark-mode pada body
    document.body.classList.toggle('dark-mode');
    
    // Simpan preferensi user ke localStorage
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
}

// Event Listener untuk tombol theme toggle
themeToggle.addEventListener('click', toggleDarkMode);

// Event Listener untuk tombol kirim
sendBtn.addEventListener('click', handleSendMessage);

// Event Listener untuk tombol Enter pada input
chatInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !isLoading) {
        handleSendMessage();
    }
});

// Event Listeners untuk tombol quick suggestions
const suggestionBtns = document.querySelectorAll('.suggestion-btn');
suggestionBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        if (!isLoading) {
            const message = this.getAttribute('data-message');
            chatInput.value = message;
            handleSendMessage();
        }
    });
});

// DOM Manipulation - Membuat efek partikel
function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
    particle.style.opacity = Math.random() * 0.5 + 0.3;
    document.body.appendChild(particle);
    
    // Menghapus partikel setelah animasi selesai
    setTimeout(() => {
        particle.remove();
    }, 5000);
}

// Membuat partikel secara berkala
setInterval(createParticle, 3000);

// DOM Manipulation - Membuat efek awan
function createCloud() {
    const cloud = document.createElement('div');
    cloud.className = 'cloud';
    cloud.style.top = Math.random() * 30 + '%';
    cloud.style.animationDuration = (Math.random() * 20 + 30) + 's';
    document.body.appendChild(cloud);
    
    // Menghapus awan setelah animasi selesai
    setTimeout(() => {
        cloud.remove();
    }, 50000);
}

// Membuat awan secara berkala
setInterval(createCloud, 8000);

// Event Listener - Load theme preference dan focus input saat halaman dimuat
window.addEventListener('load', () => {
    // Cek preferensi theme dari localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
    
    // Focus input
    chatInput.focus();
    
    // Membuat beberapa awan awal
    for (let i = 0; i < 3; i++) {
        setTimeout(createCloud, i * 2000);
    }
    
    // // Pesan selamat datang
    // setTimeout(() => {
    //     addMessage('Χαίρετε! (Salam!) Selamat datang di Greek Philosophy AI. Saya siap membantu Anda menjelajahi dunia filosofi Yunani kuno, mitologi, dan sejarah. Tanyakan apa saja! 🏛️✨', false);
    // }, 500);
});