document.addEventListener('DOMContentLoaded', () => {
    const threadForm = document.getElementById('thread-form');
    const commentForm = document.getElementById('comment-form');
    const threadList = document.getElementById('thread-list');
    const commentList = document.getElementById('comment-list');

    // Funktion för att lägga till en tråd
    const addThread = (title, message) => {
        const threadItem = document.createElement('div');
        threadItem.classList.add('thread-item');
        threadItem.innerHTML = `
            <h3>${title}</h3>
            <p>${message}</p>
        `;
        threadList.appendChild(threadItem);
    };

    // Funktion för att lägga till en kommentar
    const addComment = (message) => {
        const commentItem = document.createElement('div');
        commentItem.classList.add('comment-item');
        commentItem.innerHTML = `
            <p>${message}</p>
        `;
        commentList.appendChild(commentItem);
    };

    // Hantera skickande av trådformulär
    threadForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const title = document.getElementById('thread-title').value;
        const message = document.getElementById('thread-message').value;
        addThread(title, message);
        threadForm.reset();
    });

    // Hantera skickande av kommentarsformulär
    commentForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const message = document.getElementById('comment-message').value;
        addComment(message);
        commentForm.reset();
    });

    // Exempel på hur man kan lägga till mörkt läge
    document.addEventListener('keydown', (event) => {
        if (event.key === 'd') {
            document.body.classList.toggle('dark-mode');
        }
    });
});
