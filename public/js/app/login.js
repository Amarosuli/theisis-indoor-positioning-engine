import { auth } from "../authentication/auth.js"

let button = document.getElementById('btn-login')
document.querySelectorAll('input').forEach(input => {
   input.addEventListener('keyup', e => {
      if (e.code == 'Enter') {
         auth_login()
      } else {
         e.preventDefault()
      }
   })
})

function preSubmit(e) {
   if (e.target.textLength == 0) {
      e.target.classList.remove('focus:border-green-400', 'focus:shadow-outline-green')
      e.target.classList.add('focus:border-red-400', 'focus:shadow-outline-red')
   } else {
      e.target.classList.remove('focus:border-red-400', 'focus:shadow-outline-red')
      e.target.classList.add('focus:border-green-400', 'focus:shadow-outline-green')
   }
}

document.getElementById('email').addEventListener('keyup', (e) => preSubmit(e))
document.getElementById('password').addEventListener('keyup', (e) => preSubmit(e))

button.addEventListener('click', auth_login)

function auth_login() {
   const email = document.getElementById('email')
   const password = document.getElementById('password')
   email.nextElementSibling != null ? email.nextElementSibling.remove() : ''
   password.nextElementSibling != null ? password.nextElementSibling.remove() : ''
   // check input data
   auth.signInWithEmailAndPassword(email.value, password.value).then(user => {
         // Signed in
         window.location.href = '/admin'
      })
      .catch((error) => {
         var errorCode = error.code;
         if (errorCode == "auth/invalid-email") {

            let node = document.createElement('div')
            node.innerHTML = `<span class="text-xs text-red-700 flex py px-2 my-1 border-red-300 border-b bg-red-100 rounded-sm">Format email not valid!!!</span>`
            email.insertAdjacentElement('afterend', node)
         } else if (errorCode == "auth/user-not-found") {
            let node = document.createElement('div')
            node.innerHTML = `<span class="text-xs text-red-700 flex py px-2 my-1 border-red-300 border-b bg-red-100 rounded-sm">Your email not registered!!!</span>`
            email.insertAdjacentElement('afterend', node)
         } else if (errorCode == "auth/wrong-password") {
            let node = document.createElement('div')
            node.innerHTML = `<span class="text-xs text-red-700 flex py px-2 my-1 border-red-300 border-b bg-red-100 rounded-sm">Password not valid!!!</span>`
            password.insertAdjacentElement('afterend', node)
         } else if (errorCode == "auth/too-many-requests") {
            console.log('Too much false, wait for a minute to sign in')
         }
      })   
}