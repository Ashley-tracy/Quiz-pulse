document.addEventListener('DOMContentLoaded', () => {
    
    const getStartedBtn = document.getElementById('get-started-btn');

    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', (e) => {
            e.preventDefault();

            window.location.href = 'quiz.html'; 
        });
    } else {
        console.error("Error: Could not find the button with id 'get-started-btn'");
    }

});