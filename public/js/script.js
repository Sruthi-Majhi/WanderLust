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
const passwordInput = document.getElementById('InputPassword');
const showPasswordCheckbox = document.getElementById('showPasswordCheckbox');

showPasswordCheckbox.addEventListener('change', function () {

  if (showPasswordCheckbox.checked) {
    passwordInput.type = 'text';
  } else {
    passwordInput.type = 'password';
  }
});