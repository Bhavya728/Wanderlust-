// Dark Mode Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get the toggle button
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkIcon = document.querySelector('.dark-icon');
    const lightIcon = document.querySelector('.light-icon');
    
    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Apply the saved theme or preferred color scheme
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        lightIcon.classList.remove('d-none');
        darkIcon.classList.add('d-none');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        darkIcon.classList.remove('d-none');
        lightIcon.classList.add('d-none');
    }
    
    // Toggle dark mode on button click
    darkModeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        let newTheme;
        
        if (currentTheme === 'dark') {
            newTheme = 'light';
            darkIcon.classList.remove('d-none');
            lightIcon.classList.add('d-none');
        } else {
            newTheme = 'dark';
            lightIcon.classList.remove('d-none');
            darkIcon.classList.add('d-none');
        }
        
        // Set the new theme
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
});
