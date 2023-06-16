document.addEventListener('DOMContentLoaded', () => {

    const toggleButton = document.getElementsByClassName('nav-menu')[0]
    const navbarLinks = document.getElementsByClassName('nav-tabs')[0]
    const btnContactMe = document.querySelector('.btn-contactme');

    toggleButton.addEventListener('click', () => {
        toggleButton.classList.toggle('active'); // humberger to x mark 
        navbarLinks.classList.toggle('active'); // show nav tabs
        btnContactMe.classList.toggle('active'); // show contact me button
    });

    document.querySelectorAll('.nav-tabs a').forEach( n => {
            n.addEventListener('click', () => {
                toggleButton.classList.remove('active');
                navbarLinks.classList.remove('active');
                btnContactMe.classList.remove('active');
            });
        });
        
    document.querySelector('.btn-contactme').addEventListener('click', () => {
        btnContactMe.classList.remove('active');
        toggleButton.classList.remove('active');
        navbarLinks.classList.remove('active');
    });
})
