document.addEventListener('DOMContentLoaded', () => {
    
    const getStartedButtons = document.querySelectorAll('.get-started-btn');

    getStartedButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); 
            
            window.location.href = 'quiz.html'; 
        });
    });

});