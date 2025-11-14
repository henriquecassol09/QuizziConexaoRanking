import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getFirestore, collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyA5JoZUD5ZF-Ii2jdX6LEDlhAZRoPF1L5Q",
    authDomain: "quizziconexao.firebaseapp.com",
    projectId: "quizziconexao",
    storageBucket: "quizziconexao.firebasestorage.app",
    messagingSenderId: "671901306674",
    appId: "1:671901306674:web:f08ba9077249bb581d512b",
    measurementId: "G-01G2VY3WPM"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let userRating = 0;

const starsContainer = document.getElementById('stars-container');
const ratingFeedback = document.getElementById('rating-feedback');
const feedbackText = document.getElementById('feedback-text');
const commentInput = document.getElementById('comment-input');
const charCount = document.getElementById('char-count');
const commentsSection = document.getElementById('comments-section');
const submitCommentBtn = document.getElementById('submit-comment-btn');
const backBtn = document.getElementById('back-btn');
const successMessage = document.getElementById('success-message');

const feedbackMessages = {
    1: "Desculpe, sentiremos em melhorar! Sua opinião é valiosa para nós.",
    2: "Obrigado pelo feedback! Vamos trabalhar para melhorar.",
    3: "Que bom! Continuaremos melhorando para você.",
    4: "Ótimo! Você contribuiu para nosso sucesso.",
    5: "Excelente! Você nos motivou a continuar assim!"
};

starsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('star')) {
        const rating = parseInt(e.target.dataset.rating);
        userRating = rating;
        
        const stars = starsContainer.querySelectorAll('.star');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
        
        feedbackText.textContent = feedbackMessages[rating];
        ratingFeedback.classList.remove('hidden');
        commentsSection.classList.remove('hidden');
        
        saveRatingToFirebase(rating);
    }
});

commentInput.addEventListener('input', (e) => {
    charCount.textContent = e.target.value.length;
});

async function saveRatingToFirebase(rating) {
    try {
        await addDoc(collection(db, 'site_ratings'), {
            rating: rating,
            timestamp: serverTimestamp()
        });
        console.log("[v0] Avaliação salva:", rating);
    } catch (error) {
        console.error('Erro ao salvar avaliação:', error);
    }
}

async function saveCommentToFirebase(comment, rating) {
    try {
        await addDoc(collection(db, 'site_comments'), {
            comment: comment,
            rating: rating,
            timestamp: serverTimestamp()
        });
        console.log("[v0] Comentário salvo com sucesso");
    } catch (error) {
        console.error('Erro ao salvar comentário:', error);
    }
}

submitCommentBtn.addEventListener('click', async () => {
    const comment = commentInput.value.trim();
    
    if (!comment) {
        alert('Por favor, escreva um comentário!');
        return;
    }
    
    if (userRating === 0) {
        alert('Por favor, selecione uma avaliação primeiro!');
        return;
    }
    
    await saveCommentToFirebase(comment, userRating);
    
    commentInput.value = '';
    charCount.textContent = '0';
    
    showSuccessMessage();
});

function showSuccessMessage() {
    successMessage.classList.remove('hidden');
    setTimeout(() => {
        successMessage.classList.add('hidden');
    }, 3000);
}

backBtn.addEventListener('click', () => {
    window.history.back();
});
