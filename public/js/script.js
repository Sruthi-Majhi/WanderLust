// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  const forms = document.querySelectorAll('.needs-validation')

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()


//for show password functionality
 document.addEventListener('DOMContentLoaded', function () {
    const showPasswordCheckbox = document.getElementById('showPasswordCheckbox');
    const passwordInput = document.getElementById('InputPassword');

    showPasswordCheckbox.addEventListener('change', function () {
      passwordInput.type = this.checked ? 'text' : 'password';
    });
  });
