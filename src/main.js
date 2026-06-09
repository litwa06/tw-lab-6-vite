import './style.css'
import dayjs from 'dayjs'
const SUPABASE_URL = 'https://ymmjferqotlshbjppfad.supabase.co/rest/v1/'; 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltbWpmZXJxb3Rsc2hianBwZmFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NzY4ODEsImV4cCI6MjA5NTM1Mjg4MX0.pZPsAyAreAYxFJZRxKaJnVuZvkCAEa6Kugb7a8g0ZfE';


const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json'
};

async function fetchArticles() {
    const sortValue = document.getElementById('sortSelect').value;
    const url = `${SUPABASE_URL}/rest/v1/article?select=*&order=${sortValue}`;

    try {
        const response = await fetch(url, { headers });
        const articles = await response.json();
        displayArticles(articles);
    } catch (error) {
        console.error('Błąd pobierania:', error);
        document.getElementById('articlesList').innerHTML = `<p class="text-red-500">Błąd ładowania.</p>`;
    }
}

function displayArticles(articles) {
    const container = document.getElementById('articlesList');
    container.innerHTML = '';

    if (articles.length === 0) {
        container.innerHTML = '<p class="text-gray-500">Brak artykułów w bazie.</p>';
        return;
    }

    articles.forEach(article => {
        const formattedDate = dayjs(article.created_at).format('DD-MM-YYYY HH:mm');
        const articleEl = document.createElement('div');
        articleEl.className = 'bg-white p-6 rounded-lg shadow-sm border border-gray-200';
        articleEl.innerHTML = `
            <h3 class="text-2xl font-bold text-gray-800">${article.title}</h3>
            <h4 class="text-lg text-gray-500 mb-2">${article.subtitle || ''}</h4>
            <p class="text-gray-700 mb-4">${article.content}</p>
            <div class="flex justify-between items-center text-sm text-gray-400 border-t pt-4 mt-2">
                <span><strong>Autor:</strong> ${article.author}</span>
                <span><strong>Utworzono:</strong> ${formattedDate}</span>
            </div>
        `;
        container.appendChild(articleEl);
    });
}

async function submitArticle(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const subtitle = document.getElementById('subtitle').value;
    const author = document.getElementById('author').value;
    const content = document.getElementById('content').value;
    let created_at = document.getElementById('created_at').value;

    const newArticle = { title, subtitle, author, content };
    if (created_at) newArticle.created_at = new Date(created_at).toISOString();

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/article`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(newArticle)
        });

        if (response.ok) {
            alert('Artykuł dodany!');
            document.getElementById('articleForm').reset();
            fetchArticles();
        } else {
            const errorData = await response.json();
            alert('Błąd: ' + errorData.message);
        }
    } catch (error) {
        alert('Problem z siecią.');
    }
}
document.getElementById('sortSelect').addEventListener('change', fetchArticles);
document.getElementById('articleForm').addEventListener('submit', submitArticle);
fetchArticles();