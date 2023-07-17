document.addEventListener('DOMContentLoaded', () => {

    const toggleButton = document.getElementsByClassName('nav-menu')[0]
    const navbarLinks = document.getElementsByClassName('nav-tabs')[0]
    const btnContactMe = document.querySelector('.btn-contactme');
    const toTop = document.querySelector('.btn-top');
    const form = document.querySelector('form');

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

    // Function to toggle button visibility based on scroll position
    function toggleScrollButtonVisibility() {
        if (window.scrollY > 95) {
            toTop.style.display = 'block';
        } else {
            toTop.style.display = 'none';
        }
    }

    toggleScrollButtonVisibility();
    window.addEventListener('scroll', toggleScrollButtonVisibility);

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        // const formData = new FormData(form);
        
        const name = form.querySelector('input[name="name"]');
        const email = form.querySelector('input[name="email"]');
        const subject = form.querySelector('input[name="subject"]');
        const message = form.querySelector('textarea[name="message"]');

        handleSubmit();

        async function handleSubmit() {
            const formData = new FormData(form);

            try {
                form.querySelector('input[name="submit"]').disabled = true;
                const response = await fetch('send_email.php', {
                    method: 'POST',
                    mode: 'same-origin',
                    credentials: 'same-origin',
                    body: formData, // Send the form data as URL-encoded data
                });
        
                const res = await response.json();
        
                removeFormMessaages(form);
        
                if (res['error_msg']) {
                    form.insertAdjacentHTML('afterbegin', `<p class="sendError-msg"> ${res['error_msg']}</p>`);
                }

                if(res['name_err']) {
                    name.insertAdjacentHTML('beforebegin', `<p class="error-msg"> ${res['name_err']}</p>`);
                }
                if(res['email_err']) {
                    email.insertAdjacentHTML('beforebegin', `<p class="error-msg"> ${res['email_err']}</p>`);
                }
                if(res['message_err']) {
                    message.insertAdjacentHTML('beforebegin', `<p class="error-msg"> ${res['message_err']}</p>`);
                }

                if(res['error_msg'] || res['name_err'] || res['email_err'] || res['message_err']) {
                    form.querySelector('input[name="submit"]').disabled = false;
                    return;
                }

                if(res['success_msg']) {
                    form.insertAdjacentHTML('afterbegin', `<p class="sendSuccess-msg"> ${res['success_msg']}</p>`);
                    form.reset();
                    form.querySelector('input[name="submit"]').disabled = false;
                }
            } catch (err) {
                console.log(err);
                form.querySelector('input[name="submit"]').disabled = false;
            }
        }

        function removeFormMessaages(form) {
            form.querySelectorAll('[class*="msg"]').forEach(msg => {
                msg.remove();
            })
        }
    });
})