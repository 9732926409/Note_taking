// Select elements
const textNoteInput = document.getElementById('text-note');
const saveTextNoteButton = document.getElementById('save-text-note');
const startVoiceNoteButton = document.getElementById('start-voice-note');
const voiceStatus = document.getElementById('voice-status');
const imageUploadInput = document.getElementById('image-upload');
const saveImageNoteButton = document.getElementById('save-image-note');
const notesContainer = document.getElementById('notes-container');

// Save text note
saveTextNoteButton.addEventListener('click', () => {
    const text = textNoteInput.value.trim();
    if (text) {
        addNoteToList({ type: 'text', content: text });
        textNoteInput.value = '';
    } else {
        alert('Please write something in the note!');
    }
});

// Voice note functionality
let recognition;
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
        voiceStatus.textContent = 'Recording... Speak now.';
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        addNoteToList({ type: 'text', content: transcript });
        voiceStatus.textContent = 'Press to start recording...';
    };

    recognition.onerror = () => {
        voiceStatus.textContent = 'Error occurred. Try again.';
    };

    recognition.onend = () => {
        voiceStatus.textContent = 'Press to start recording...';
    };
} else {
    voiceStatus.textContent = 'Speech recognition not supported in your browser.';
    startVoiceNoteButton.disabled = true;
}

startVoiceNoteButton.addEventListener('click', () => {
    if (recognition) recognition.start();
});

// Save image note
saveImageNoteButton.addEventListener('click', () => {
    const file = imageUploadInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            addNoteToList({ type: 'image', content: reader.result });
        };
        reader.readAsDataURL(file);
        imageUploadInput.value = '';
    } else {
        alert('Please select an image!');
    }
});

// Add note to list
function addNoteToList(note) {
    const listItem = document.createElement('li');
    listItem.classList.add('note-item');
    if (note.type === 'text') {
        listItem.textContent = note.content;
    } else if (note.type === 'image') {
        const img = document.createElement('img');
        img.src = note.content;
        listItem.appendChild(img);
    }
    notesContainer.appendChild(listItem);
}
