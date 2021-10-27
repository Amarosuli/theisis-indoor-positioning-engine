import {
    auth
} from './authentication/auth.js'

import {
    enginelist, users
} from './database/db.js'

window.logout = function logout() {
    auth.signOut()
    window.location.href = '/public'
}

auth.onAuthStateChanged(user => {
    if (user == null) {
        window.location.href = '/public'
    } else {
        document.getElementById('top_user_image').src=`/img/users/${user.uid}.jpg`
        users.child(user.uid).get().then((data) => {
            if (window.location.pathname == '/admin/profile' || window.location.pathname == '/admin/profile/') {
                document.getElementById('user_image').src=`/img/users/${user.uid}.jpg`
                document.getElementById('user_name').innerText = data.val().user_name
                document.getElementById('user_email').innerText = user.email
            }
        })
    }
})


var totalEngine, unserviceable, serviceable, wip, transportation_stand, preservation
unserviceable = 0
serviceable = 0
wip = 0
transportation_stand = 0
preservation = 0

if (window.location.pathname == '/admin/' || window.location.pathname == '/admin') {
    enginelist.on('value', function (data) {
        totalEngine = data.numChildren()
        document.querySelector('.total_engine').innerText = `${totalEngine} EA`
        data.forEach(value => {
            value.val().status == "Unserviceable" ? unserviceable += 1 : unserviceable += 0
            document.querySelector('.unserviceable').innerText = `${unserviceable} EA`

            value.val().status == "Serviceable" ? serviceable += 1 : serviceable += 0
            document.querySelector('.serviceable').innerText = `${serviceable} EA`

            value.val().status == "WIP" ? wip += 1 : wip += 0
            document.querySelector('.wip').innerText = `${wip} EA`

            value.val().storage.s_type == "ETS" ? transportation_stand += 1 : transportation_stand += 0
            document.querySelector('.transportation_stand').innerText = `${transportation_stand} EA`

            if (value.val().preserve_date != NaN) {
                Math.floor((((Date.now() - new Date(value.val().preserve_date)) / 1000) / 3600) / 24) < 7 ? preservation += 1 : preservation += 0
            }
            document.querySelector('.preservation').innerText = `${preservation} EA`
        })
    })
} else {

}