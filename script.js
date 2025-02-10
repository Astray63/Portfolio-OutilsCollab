document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const submitBtn = form.querySelector('.submit-btn');
    const formGroups = form.querySelectorAll('.form-group');
    
    const loadingSpinner = document.createElement('div');
    loadingSpinner.className = 'loading-spinner';
    submitBtn.appendChild(loadingSpinner);

    // RegEX
    const patterns = {
        name: /^[a-zA-ZÀ-ÿ\s]{2,50}$/,
        email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
        subject: /^.{2,100}$/,
        message: /^.{10,1000}$/
    };

 
    const errorMessages = {
        name: 'Le nom doit contenir entre 2 et 50 caractères',
        email: 'Veuillez entrer une adresse email valide',
        subject: 'Le sujet doit contenir entre 2 et 100 caractères',
        message: 'Le message doit contenir entre 10 et 1000 caractères'
    };


    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        const errorText = document.createElement('div');
        errorText.className = 'error-text';
        group.appendChild(errorText);


        input.addEventListener('input', () => validateField(input));
        input.addEventListener('blur', () => validateField(input));
    });


    function validateField(field) {
        const pattern = patterns[field.id];
        const group = field.closest('.form-group');
        const errorText = group.querySelector('.error-text');
        
        if (!pattern.test(field.value)) {
            group.classList.add('has-error');
            errorText.textContent = errorMessages[field.id];
            return false;
        } else {
            group.classList.remove('has-error');
            errorText.textContent = '';
            return true;
        }
    }


    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        

        let isValid = true;
        formGroups.forEach(group => {
            const input = group.querySelector('input, textarea');
            if (!validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) return;


        submitBtn.classList.add('loading');

        try {
            const formData = new FormData(form);
            const response = await fetch('https://formsubmit.co/ajax/elijahlasserre63@gmail.com', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                showMessage('success', 'Votre message a été envoyé avec succès !');
                form.reset();
            } else {
                throw new Error('Erreur réseau');
            }
        } catch (error) {
            showMessage('error', 'Une erreur est survenue. Veuillez réessayer plus tard.');
        } finally {
            submitBtn.classList.remove('loading');
        }
    });


    function showMessage(type, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `${type}-message`;
        messageDiv.textContent = text;
        

        const existingMessages = document.querySelectorAll('.success-message, .error-message');
        existingMessages.forEach(msg => msg.remove());
        

        form.insertAdjacentElement('afterend', messageDiv);
        

        setTimeout(() => messageDiv.remove(), 5000);
    }
});