import {} from "../firebase/config.js";

export const auth = firebase.auth();

// export const authStatus = auth.onAuthStateChanged(user => {
//    if (user !== null) {} else {
//       window.location.href = '/main-public'
//    }
// })

// export const authCreate = auth.createUserWithEmailAndPassword(email, password).then(cred => {
//     console.log(cred)
// })

// export const authOut = auth.signOut().then(() => {
//     console.log('User Log Out')
// })

// export const authIn = auth.signInWithEmailAndPassword('maulana.haikal@gmf-aeroasia.co.id', 'Admin1234').then(cred => {
//     console.log(cred.user)
// })