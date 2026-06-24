const API_URL = 'http://localhost:3000/api';
const heroPhrases = [
    'Adaptive neural interface',
    'Realtime analytics',
    'Holographic web control',
    'Futuristic user journeys'
];

function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add('ripple');

    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
        ripple.remove();
    }

    button.appendChild(circle);
}

function animateHeroText() {
    const heroHeader = document.querySelector('.hero-copy h2');
    const phraseContainer = document.createElement('span');
    phraseContainer.className = 'hero-phrase';
    heroHeader.appendChild(document.createTextNode(' '));
    heroHeader.appendChild(phraseContainer);

    let index = 0;
    setInterval(() => {
        phraseContainer.textContent = heroPhrases[index];
        index = (index + 1) % heroPhrases.length;
    }, 2800);
}

async function loadUsers() {
    try {
        const response = await fetch(`${API_URL}/users`);
        const users = await response.json();
        const usersList = document.getElementById('usersList');

        if (!Array.isArray(users) || users.length === 0) {
            usersList.innerHTML = '<p>No users found in database.</p>';
            return;
        }

        usersList.innerHTML = users.map(user => `
            <div class="user-card">
                <div class="user-info">
                    <h4>👤 ${user.name}</h4>
                    <p>📧 ${user.email}</p>
                    <p>🎂 Age: ${user.age || 'N/A'}</p>
                    <p>📅 Added: ${new Date(user.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                    <button onclick="deleteUser(${user.id})" class="btn btn-danger">🗑️ Delete</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading users:', error);
        document.getElementById('usersList').innerHTML = '<p style="color: #ff7f7f;">❌ Error loading users. Make sure the server is running!</p>';
    }
}

async function deleteUser(id) {
    if (!confirm('Are you sure you want to remove this user from the Nexus?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/users/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('✅ User deleted successfully!');
            loadUsers();
        } else {
            alert('❌ Failed to delete user');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error deleting user');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
    animateHeroText();

    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', createRipple);
    });
});

const userForm = document.getElementById('userForm');
if (userForm) {
    userForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            age: document.getElementById('age').value || null
        };

        try {
            const response = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                alert('✅ User added successfully!');
                userForm.reset();
                loadUsers();
            } else {
                alert('❌ Error: ' + (data.error || 'Unable to save user.'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('❌ Failed to add user. Is the server running?');
        }
    });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});