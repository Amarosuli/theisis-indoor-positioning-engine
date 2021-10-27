import {
    enginelist
} from '../database/db.js'

// control svg & gsap

const svgs = document.getElementById('engine');
const svgsx = "http://www.w3.org/2000/svg";
const shape = {
    face0: "M1342.24,628.14h-9a.93.93,0,0,1-.92-.76l-.29-1.46a9.73,9.73,0,0,1,.48-5.47l1.12-2.87-1.16-5.54h-5.34a0,0,0,0,1,0,0V601.9a0,0,0,0,1,0,0h21.91a0,0,0,0,1,0,0V612a0,0,0,0,1,0,0H1343l-1.16,5.54,1.12,2.87a9.82,9.82,0,0,1,.48,5.47l-.29,1.46A1,1,0,0,1,1342.24,628.14Z",
    face90: "M1323,650.1v-9a1,1,0,0,1,.76-.93l1.46-.29a10,10,0,0,1,5.48.48l2.87,1.12,5.53-1.15V635a0,0,0,0,1,0,0h10.1a0,0,0,0,1,0,0V657a0,0,0,0,1,0,0h-10.09a0,0,0,0,1-.05,0v-6.08l-5.53-1.16-2.87,1.12a10,10,0,0,1-5.48.48l-1.46-.29A1,1,0,0,1,1323,650.1Z",
    face180: "M1334,532.86h9a1,1,0,0,1,.93.76l.29,1.46a9.82,9.82,0,0,1-.48,5.47l-1.12,2.87,1.16,5.54h5.33a0,0,0,0,1,0,0v10.1a0,0,0,0,1,0,0h-21.92a0,0,0,0,1,0,0V549a0,0,0,0,1,0,0h6.08l1.16-5.54-1.12-2.87a9.73,9.73,0,0,1-.48-5.47l.29-1.46A.93.93,0,0,1,1334,532.86Z",
    face270: "M1351.29,575.9v9a1,1,0,0,1-.76.93l-1.47.29a9.91,9.91,0,0,1-5.47-.48l-2.87-1.12-5.54,1.15V591a0,0,0,0,1,0,0H1325a0,0,0,0,1,0,0V569a0,0,0,0,1,0,0h10.1a0,0,0,0,1,0,0v6.08l5.54,1.16,2.87-1.12a9.91,9.91,0,0,1,5.47-.48l1.47.29A1,1,0,0,1,1351.29,575.9Z"
}

var alertEvent = Swal.mixin({
    toast: true,
    position: 'bottom-start',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

var activePath = window.location.pathname == '/admin/map/' || window.location.pathname == '/admin/map'

enginelist.on('child_added', function(data) {
    render(data)
    if (activePath) {
        draggable(data.val())
    }
})

function render(data) {
    const engine = data.val()

    let render = document.createElementNS(svgsx, "path")
    gsap.set(render, {
        attr: {
            class: `draggable ${engine.esn}`,
            id: data.key,
            d: shape[engine.shape],
            transform: "translate(" + engine.x + " " + engine.y + ")",
            'data-tippy-content': `<span> ${engine.esn} | ${engine.customer} </span>`,
        }
    })
    svgs.appendChild(render)

    // tooltip
    tippy(document.getElementsByClassName(engine.esn)[0], {
        placement: 'top-start',
        allowHTML: true,
        arrow: false,
        theme: 'light',
        hideOnClick: true,
    })
}

function draggable(data) {
    // activate the draggable 
    let bound = document.getElementById("outer")
    let childrenOf = document.getElementById("area").children
    let target = document.getElementsByClassName(data.esn)
    Draggable.create(target, {
        type: "x, y",
        edgeResistance: 0.5,
        bounds: bound,
        onClick: function() {
            const id = this.target.id
            showInfo(id)
        },
        onDrag: function(e) {
            enginelist.child('/' + this.target.id + '/x').set(this.x);
            enginelist.child('/' + this.target.id + '/y').set(this.y);
        },
        onDragEnd: function(e) {
            var i = childrenOf.length
            // isCollide(this.target)
            while (--i > -i) {
                if (this.hitTest(childrenOf[i])) {
                    // update location
                    enginelist.child('/' + this.target.id + '/location').set(childrenOf[i].id); // return element overlapping
                }
            }
        }
    })
}

document.getElementById("search").addEventListener("keyup", function() {
    
    try {
        let td = document.getElementsByClassName("found")[0]
        td.classList.remove("found")
        const target = document.getElementsByClassName('tippy-box')[0].parentElement._tippy
        target.hide()
    } catch (error) {}
    
    let className = document.getElementById("search").value
    let found = document.getElementsByClassName(className)[0]
    if (found) {
        this.classList.remove('focus:bg-red-200', 'focus:border-red-300')
        this.classList.add('focus:bg-green-200', 'focus:border-green-300')
        found.classList.add("found")
        const tip = tippy(found, {
            placement: 'top-start',
            allowHTML: true,
            arrow: false,
            theme: 'light',
            hideOnClick: true,
        })
        const el = document.querySelector('.found')
        tip.show(el)
    } else {
        if (this.textLength == 0) {
            this.classList.remove('focus:bg-red-200', 'focus:border-red-300')
            this.classList.add('focus:bg-white', 'focus:border-green-300')
        } else {
            this.classList.remove('focus:bg-green-200', 'focus:border-green-300')
            this.classList.add('focus:bg-red-200', 'focus:border-red-300')
        }
    }
})

// show left bar engine info using sweetalert
window.showInfo = function showInfo(id) {
    enginelist.child(id).get().then((data) => {
        const engine = data.val()
        swal.fire({
            toast: false,
            icon: 'info',
            position: 'top-start',
            title: 'Engine Information',
            showCancelButton: true,
            focusCancel: true,
            html: `
         <table class="w-full whitespace-no-wrap text-left">
            <thead>
               <tr
                  class="bg-green-300 text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 dark:text-gray-400 dark:bg-gray-700">
                  <th class="px-4 py-3">Label</th>
                  <th class="px-4 py-3">Detail</th>
               </tr>
            </thead>
            <tbody id="target-data" class="bg-white divide-y dark:divide-gray-700 dark:bg-gray-700">
               <tr class="text-gray-700 dark:text-gray-400">
                  <td class="px-4 py-3 text-sm">TYPE</td>
                  <td class="px-4 py-3 text-sm">${engine.type}</td>
               </tr>
               <tr class="text-gray-700 dark:text-gray-400">
                  <td class="px-4 py-3 text-sm">ESN</td>
                  <td class="px-4 py-3 text-sm">${engine.esn}</td>
               </tr>
               <tr class="text-gray-700 dark:text-gray-400">
                  <td class="px-4 py-3 text-sm">CUSTOMER</td>
                  <td class="px-4 py-3 text-sm">${engine.customer}</td>
               </tr>
               <tr class="text-gray-700 dark:text-gray-400">
                  <td class="px-4 py-3 text-sm">LOCATION</td>
                  <td class="px-4 py-3 text-sm">${engine.location}</td>
               </tr>
               <tr class="text-gray-700 dark:text-gray-400">
                  <td class="px-4 py-3 text-sm">LAST PRESERVE</td>
                  <td class="px-4 py-3 text-sm">${engine.preserve_date}</td>
               </tr>
               <tr class="text-gray-700 dark:text-gray-400">
                  <td class="px-4 py-3 text-sm">DIRECTION</td>
                  <td id="${data.key}" class="px-4 py-3 text-sm flex space-x-2">

                  <button id="face0" class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-green-600 rounded-lg dark:text-gray-400 outline-none hover:bg-green-100 focus:outline-none focus:shadow-outline-green" onclick="turn(this)">
                  <svg class="w-5 h-5" fill="none" aria-hidden="true"  stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z"></path></svg></button>
                  
                  <button id="face90" class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-green-600 rounded-lg dark:text-gray-400 outline-none hover:bg-green-100 focus:outline-none focus:shadow-outline-green" onclick="turn(this)">
                  <svg class="w-5 h-5" fill="none" aria-hidden="true"  stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></button>
                  
                  <button id="face180" class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-green-600 rounded-lg dark:text-gray-400 outline-none hover:bg-green-100 focus:outline-none focus:shadow-outline-green" onclick="turn(this)">
                  <svg class="w-5 h-5" fill="none" aria-hidden="true"  stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z"></path></svg></button>
                  
                  <button id="face270" class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-green-600 rounded-lg dark:text-gray-400 outline-none hover:bg-green-100 focus:outline-none focus:shadow-outline-green" onclick="turn(this)">
                  <svg class="w-5 h-5" fill="none" aria-hidden="true"  stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"></path></svg></button>
                  
                  </td>
               </tr>
            </tbody>
         </table>
         `,
            showConfirmButton: false,
            showCloseButton: false,
            allowOutsideClick: true,
            backdrop: true,
            showClass: {
                popup: `
              animate__animated
              animate__fadeInLeft
              animate__faster
            `
            },
            hideClass: {
                popup: `
              animate__animated
              animate__fadeOutLeft
              animate__faster
            `
            },
            grow: 'column',
            width: 400,
        })
    })
}

window.turn = turn

function turn(value) {
    let shape = value.id
    let selected = value.parentElement.id
    enginelist.child('/' + selected + '/shape').set(shape)
}

// re render (particularly) if engine attribute has change, so we use the "on" function. This prevent all data reload, it's easier to reload
enginelist.on('child_changed', function(data) {
    const engine = data.val()
    gsap.set("#" + data.key, {
        attr: {
            d: shape[engine.shape],
            transform: "translate(" + engine.x + " " + engine.y + ")",
        }
    });
});

// remove rendered engine (particularly) when data removed
enginelist.on('child_removed', function(data) {
    console.log("ada engine yang di hapus nih")
    document.getElementById(data.key).remove()
    alertEvent.fire({
        icon: 'success',
        title: `1 Engine Removed`,
    })
})