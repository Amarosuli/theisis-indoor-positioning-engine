import {
   enginelist,
   storagelist,
   enginetype,
   statuslist,
   customerlist
} from '../database/db.js'

var activePath = window.location.pathname == '/public/engine-list/' || window.location.pathname == '/public/engine-list'
window.addEventListener('DOMContentLoaded', () => {
   activePath ? document.querySelectorAll('th')[9].classList.add('hidden') : ''
})

document.getElementById('engineForm').onload = switchForm()
// CONTROL FORM 
window.switchForm = switchForm

function switchForm() {

   // get parent of storage type form element
   let filterBy = document.getElementById('filterBy')
   // get type of storage choosed by user
   let engine_type = document.getElementById('engine_type')
   let customer = document.getElementById('customer')
   let status = document.getElementById('status')


   // using switch for DOM storage type form
   switch (filterBy.value) {
      case "engine_type":
         unset()
         engine_type.classList.remove("hidden");
         customer.classList.add("hidden");
         status.classList.add("hidden");
         set()
         break;
      case "customer":
         unset()
         status.classList.add("hidden");
         engine_type.classList.add("hidden");
         customer.classList.remove("hidden");
         set()
         break;
      case "status":
         unset()
         engine_type.classList.add("hidden");
         customer.classList.add("hidden");
         status.classList.remove("hidden");
         set()
         break;
      default:
         unset()
         engine_type.classList.add("hidden");
         customer.classList.add("hidden");
         status.classList.add("hidden");
   }
}

// get Data
function render(data) {
   const svgs = document.getElementById('target-data')
   let render = ''
   let sizeData = data.length
   document.getElementById('length-data').innerText = `Showing ${sizeData} of ${sizeData}`
   data.forEach(function (data) {
      render += `
      <tr class="text-gray-700 dark:text-gray-400 ">
         <td class="px-4 py-3">
            <div class="flex items-center text-xs">
               <div class="relative hidden w-8 h-8 mr-3 rounded md:block">
                  <img class="object-cover p-1 w-full h-full rounded"
                     src="/img/company/${data.customer}.png" alt="${data.customer}" loading="lazy" />
                  <div class="absolute inset-0 rounded shadow-inner" aria-hidden="true"></div>
               </div>
               <div>
                  <p class="font-semibold">${data.esn}</p>
               </div>
            </div>
         </td>
         <td class="px-4 py-3 text-xs">${data.type + data.config}</td>
         <td class="px-4 py-3 text-xs">${data.customer}</td>
         <td class="px-4 py-3 text-xs">
            ${data.status == 'Serviceable' ?
            `<span class="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100">${data.status}</span>`
            : data.status == 'Unserviceable' ?
               `<span class="px-2 py-1 font-semibold leading-tight text-gray-700 bg-gray-100 rounded-full dark:text-gray-100 dark:bg-gray-700">${data.status}</span>`
               : `<span class="px-2 py-1 font-semibold leading-tight text-orange-700 bg-orange-100 rounded-full dark:text-white dark:bg-orange-500">${data.status}</span>`
         }
         
         </td>
         <td class="px-4 py-3 text-xs">
            <div> <span class="px-2 py-1 font-semibold"> ${data.dateIn ? new Date(data.dateIn).toLocaleDateString() : 'no data'} </span> </div>
            <div> <span class="px-2 py-1 leading-tight text-gray-600 dark:text-gray-400"> TAT: ${data.dateIn ? getTAT(data.dateIn) : '-'} days </span> </div>
         </td>
         <td class="px-4 py-3 text-xs">
            <div> <span class="px-2 py-1 font-semibold"> Prev ${data.preserve_date ? new Date(data.preserve_date).toLocaleDateString() : 'no tag'} </span> </div>
            <div> <span class="px-2 py-1 leading-tight text-gray-600 dark:text-gray-400"> Next ${data.preserve_date ? getNextPreserve(data.preserve_date, data.preserve_type) : '-'} </span>
            </div>
         </td>
         <td class="px-4 py-3 text-xs">${data.location}</td>
         <td class="px-4 py-3 text-xs">
            <button class="border border-green-100 inline-flex items-center justify-center w-full px-2 py-1 text-xs font-semibold transition-colors duration-150 rounded-md hover:bg-green-100 focus:outline-none hover:text-gray-800 dark:hover:bg-gray-600 dark:border-gray-100 dark:hover:text-gray-200" onclick="storage(this)"><span>${data.storage.s_type}</span></button>
         </td>
      </tr>
      `
   });
   svgs.innerHTML = render
}

// get Next Preserve Date
function getNextPreserve(preserve_date, preserve_type) {
   let date = new Date(preserve_date).getTime()
   let type = date + (preserve_type * 86400000)
   let next = new Date(type)
   return next.toLocaleDateString()
}

// count TAT
function getTAT(dateIn) {
   return Math.floor((((Date.now() - new Date(dateIn)) / 1000) / 3600) / 24)
}


function set() {

   let i = 1
   enginetype.once('value', function (d) {
      d.forEach(t => {
         let type = document.getElementById('type_option')
         let option = document.createElement("option")
         option.text = t.val().type
         option.value = t.val().type
         type.add(option, type[i])
         i++
      });
   })

   customerlist.once('value', function (d) {
      d.forEach(t => {
         let type = document.getElementById('customer_option')
         let option = document.createElement("option")
         option.text = t.val()
         option.value = t.key
         type.add(option, type[i])
         i++
      });
   })

   statuslist.once('value', function (d) {
      d.forEach(t => {
         let type = document.getElementById('status_option')
         let option = document.createElement("option")
         option.text = t.val()
         option.value = t.key
         type.add(option, type[i])
         i++
      });
   })

}

function unset() {
   document.getElementById('type_option').length = 1
   document.getElementById('customer_option').length = 1
   document.getElementById('status_option').length = 1
}

// show detail storage
window.storage = function storage(value) {
   let id = value.parentElement.parentElement.id
   enginelist.child(id + "/storage").once('value', function (data) {
      let detail = data.val().s_detail
      if (detail !== undefined) {
         storagelist.once('value').then(function (snap) {
            let isTrue = snap.hasChild(detail)
            isTrue ? alert(snap.val()) : console.log(detail)
         })
      } else {
         alert("haha")
      }
   })
}

window.pdf = function pdf() {
   // let element = document.getElementById('engine-table');
   let element = document.getElementById('preview_block');
   let opt = {
      margin: 0.2,
      filename: 'Report.pdf',
      image: { type: 'png' },
      html2canvas: { scale: 1.0 },
      jsPDF: { unit: 'in', format: 'legal', orientation: 'l' }
   };
   html2pdf().set(opt).from(element).save();
}

document.getElementById('pdf').addEventListener('click', e => {
   e.preventDefault()
   pdf()
})

let filter = document.getElementById('filterBy')
filter.addEventListener('change', () => {
   report(filter.value)
})
filter.onload = preview('all')

function report(filter) {
   let type_option = document.getElementById('type_option'),
   customer_option = document.getElementById('customer_option'),
   status_option = document.getElementById('status_option')

   if (filter == 'engine_type') {
      type_option.addEventListener('change', () => {
         preview('et', type_option.value)
      })
   } else if (filter == 'customer') {
      customer_option.addEventListener('change', () => {
         preview('c', customer_option.value)
      })
   } else if (filter == 'status') {
      status_option.addEventListener('change', () => {
         preview('s', status_option.value)
      })
   }
}

function preview(control, data) {
   let arx = []
   if (control == 'et') {
      enginelist.orderByChild('type').once('value', (d) => {
         d.forEach(t => {
            arx.push(t.val())
         })
         let m = arx.filter(r => r.type == data)
         render(m)
      })
   }
   if (control == 'c') {
      enginelist.orderByChild('customer').once('value', (d) => {
         d.forEach(t => {
            arx.push(t.val())
         })
         let m = arx.filter(r => r.customer == data)
         render(m)
      })
   }
   if (control == 's') {
      enginelist.orderByChild('status').once('value', (d) => {
         d.forEach(t => {
            arx.push(t.val())
         })
         let m = arx.filter(r => r.status == data)
         render(m)
      })
   }
   if (control == 'all') {
      enginelist.once('value', (d) => {
         d.forEach(t => {
            arx.push(t.val())
         })
         render(arx)
      })
   }
}