document.addEventListener('DOMContentLoaded', function () {
    const createNotebookBtn = document.querySelector('.create-notebook button');
    const joinNotebookBtn = document.querySelector('.join-notebook button');
    const notebookCodeDisplay = document.getElementById('notebook-code');

    createNotebookBtn.addEventListener('click', createNotebook);
    joinNotebookBtn.addEventListener('click', joinNotebook);

    function createNotebook() {
        const notebookCode = generateNotebookCode();
        displayNotebookCode(notebookCode);

        window.location.href = `notebook.html?code=${notebookCode}`;
    }

    function joinNotebook() {
        const enteredCode = prompt('Enter the notebook code:');
        if (validateNotebookCode(enteredCode)) {
            window.location.href = `notebook.html?code=${enteredCode}`;
        } else {
            alert('Invalid notebook code. Please try again.');
        }
    }

    function generateNotebookCode() {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    function displayNotebookCode(code) {
        notebookCodeDisplay.textContent = `Your Notebook Code: ${code}`;
    }

    function validateNotebookCode(code) {
        if (code === null || !code.match(/^[a-zA-Z0-9]+$/)) {
            return false;
        }
        return true;
    }
});
const footer = document.querySelector('footer');
const codeElement = document.createElement('code');
codeElement.textContent = '';
footer.appendChild(codeElement);
