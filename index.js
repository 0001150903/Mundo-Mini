// Aguarda o carregamento completo do DOM antes de executar o script
document.addEventListener('DOMContentLoaded', () => {

    // =================================================================
    // FUNCIONALIDADE 1: SCROLL SUAVE (SMOOTH SCROLLING)
    // =================================================================
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // =================================================================
    // FUNCIONALIDADE 2: ANIMAÇÃO AO ROLAR (SCROLL REVEAL)
    // =================================================================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Opcional: Para que a animação ocorra apenas uma vez
                observer.unobserve(entry.target); 
            }
        });
    }, {
        threshold: 0.1 // Ativa quando 10% do elemento estiver visível
    });

    // Seleciona TODOS os elementos com a classe 'hidden' que queremos animar.
    // Isso inclui os itens de benefício, a tabela, TODAS AS IMAGENS DE COLEÇÃO E TODOS OS DEPOIMENTOS.
    const elementsToAnimate = document.querySelectorAll('.beneficio-item.hidden, .tabela-container.hidden, .colecao-imagem-container.hidden, .depoimento-item.hidden');
    elementsToAnimate.forEach(el => observer.observe(el));


    // =================================================================
    // FUNCIONALIDADE 3: VALIDAÇÃO E ENVIO DO FORMULÁRIO (com Formspree)
    // =================================================================
    const form = document.querySelector('form');
    const formMessage = document.getElementById('form-message');
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/; 

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefone = document.getElementById('telefone').value.trim();

        let isValid = true;
        let errorMessage = '';

        // --- VALIDAÇÃO ---
        if (nome === '') {
            errorMessage += 'O campo Nome é obrigatório. ';
            isValid = false;
        }

        if (email === '') {
            errorMessage += 'O campo Email é obrigatório. ';
            isValid = false;
        } else if (!emailRegex.test(email)) {
            errorMessage += 'Por favor, insira um email válido. ';
            isValid = false;
        }

        if (telefone !== '' && !phoneRegex.test(telefone)) {
            errorMessage += 'Por favor, insira um telefone válido (Ex: (XX) XXXXX-XXXX). ';
            isValid = false;
        }

        // --- EXIBIR ERROS OU ENVIAR ---
        if (!isValid) {
            formMessage.textContent = errorMessage;
            formMessage.className = 'error';
        } else {
            formMessage.textContent = 'Enviando sua inscrição...';
            formMessage.className = '';

            try {
                const formData = new FormData(form);
                
                const response = await fetch(form.action, {
                    method: form.method,
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    formMessage.textContent = `Obrigado, ${nome}! Você foi adicionado à Lista VIP com sucesso!`;
                    formMessage.className = 'success';
                    form.reset();
                } else {
                    const data = await response.json();
                    if (data.errors) {
                        errorMessage = data.errors.map(err => err.message).join(' ');
                    } else {
                        errorMessage = 'Ocorreu um erro ao se inscrever. Tente novamente.';
                    }
                    formMessage.textContent = errorMessage;
                    formMessage.className = 'error';
                }
            } catch (error) {
                formMessage.textContent = 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.';
                formMessage.className = 'error';
                console.error('Erro de envio:', error);
            }
        }
    });
});