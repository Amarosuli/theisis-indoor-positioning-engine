import {
   enginelist,
   storagelist,
   enginetype,
   statuslist,
   customerlist
} from '../database/db.js'

import { excel } from '../external/Excel.js'



var activePath = window.location.pathname == '/public/engine-list/' || window.location.pathname == '/public/engine-list'
window.addEventListener('DOMContentLoaded', () => {
   activePath ? document.querySelectorAll('th')[9].classList.add('hidden') : ''
})

// get Data
enginelist.on('value', function (data) {
   const svgs = document.getElementById('target-data')
   let render = ''
   let sizeData = data.numChildren()
   document.getElementById('length-data').innerText = `Showing ${sizeData} of ${sizeData}`
   data.forEach(function (data) {

      var engine = data.val()
      render += `
      <tr class="text-gray-700 dark:text-gray-400 " id="${data.key}">
         <td class="px-4 py-3">
            <div class="flex items-center text-xs">
               <div class="relative hidden w-8 h-8 mr-3 rounded md:block">
                  <img class="object-cover p-1 w-full h-full rounded"
                     src="/img/company/${engine.customer}.png" alt="${engine.customer}" loading="lazy" />
                  <div class="absolute inset-0 rounded shadow-inner" aria-hidden="true"></div>
               </div>
               <div>
                  <p class="font-semibold">${engine.esn}</p>
               </div>
            </div>
         </td>
         <td class="px-4 py-3 text-xs">${engine.type + engine.config}</td>
         <td class="px-4 py-3 text-xs">${engine.customer}</td>
         <td class="px-4 py-3 text-xs">
            ${engine.status == 'Serviceable' ?
            `<span class="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100">${engine.status}</span>`
            : engine.status == 'Unserviceable' ?
               `<span class="px-2 py-1 font-semibold leading-tight text-gray-700 bg-gray-100 rounded-full dark:text-gray-100 dark:bg-gray-700">${engine.status}</span>`
               : `<span class="px-2 py-1 font-semibold leading-tight text-orange-700 bg-orange-100 rounded-full dark:text-white dark:bg-orange-500">${engine.status}</span>`
         }
         
         </td>
         <td class="px-4 py-3 text-xs">
            <div> <span class="px-2 py-1 font-semibold"> ${engine.dateIn ? new Date(engine.dateIn).toLocaleDateString() : 'no data'} </span> </div>
            <div> <span class="px-2 py-1 leading-tight text-gray-600 dark:text-gray-400"> TAT: ${engine.dateIn ? getTAT(engine.dateIn) : '-'} days </span> </div>
         </td>
         <td class="px-4 py-3 text-xs">
            <div> <span class="px-2 py-1 font-semibold"> Prev ${engine.preserve_date ? new Date(engine.preserve_date).toLocaleDateString() : 'no tag'} </span> </div>
            <div> <span class="px-2 py-1 leading-tight text-gray-600 dark:text-gray-400"> Next ${engine.preserve_date ? getNextPreserve(engine.preserve_date, engine.preserve_type) : '-'} </span>
            </div>
         </td>
         <td class="px-4 py-3 text-xs">${engine.reason}</td>
         <td class="px-4 py-3 text-xs">${engine.location}</td>
         <td class="px-4 py-3 text-xs">
            <button class="border border-green-100 inline-flex items-center justify-center w-full px-2 py-1 text-xs font-semibold transition-colors duration-150 rounded-md hover:bg-green-100 focus:outline-none hover:text-gray-800 dark:hover:bg-gray-600 dark:border-gray-100 dark:hover:text-gray-200" onclick="storage(this)"><span>${engine.storage.s_type}</span></button>
         </td>
         <td class="px-4 py-3 ${activePath ? 'hidden' : ''}">
            <div class="flex items-center space-x-4 text-sm" id="${engine.esn}">
               <button class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-green-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray" onclick="edit(this)" aria-label="Edit">
               <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"> <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>
               </button>
               <button class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-green-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray" onclick="remove(this)" aria-label="Delete">
               <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
               </button>
            </div>
         </td>
      </tr>
      `
   });
   svgs.innerHTML = render
})

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

// export to Excel
// document.getElementById('export-table').addEventListener("click", function (e) {
//    // e.preventDefault()
//    excel.set('engine-table', 'engine-list')
//    excel.export()
// })

// remove data
window.remove = function remove(value) {
   let int = value.parentElement.parentElement.parentElement
   console.log(int)
   let del = enginelist.child(int.id)
   Swal.fire({
      width: 400,
      title: `Delete ESN ${value.parentElement.id} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes`,
      customClass: {
         icon: 'text-xs',
      }
   }).then((result) => {
      if (result.isConfirmed) {
         del.remove()
         Swal.fire({
            width: 400,
            icon: 'success',
            title: `ESN ${value.parentElement.id} Removed!`,
            showConfirmButton: false,
            customClass: {
               icon: 'text-xs',
            }
         })
      }
   })
}

// edit data
window.edit = function edit(value) {
   let int = value.parentElement.parentElement.parentElement
   var engine, storage
   enginelist.child(int.id).once('value', function (d) {
      engine = d.val()
   })

   set(engine.storage.s_detail, engine.customer, engine.status, engine.type)

   Swal.fire({
      width: 1000,
      background: "#f4f5f7",
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
      html: `
      <div id="${int.id}">
      <form id="engineForm" class="w-full justify-center pt-6 grid md:grid-cols-2 md:gap-4" autocomplete="off">
               <div id="left block">
                  <!-- General Engine Information -->
                  <h4 class="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">
                     Engine Information
                  </h4>
                  <div class="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
                     <label class="block text-sm">
                        <span class="text-gray-700 dark:text-gray-400">Engine Serial Number</span>
                        <input id="esnForm" required
                           class="block w-full mt-1 text-sm dark:border-green-600 dark:bg-gray-700 focus:border-green-400 focus:outline-none focus:shadow-outline-green dark:text-gray-300 dark:focus:shadow-outline-green form-input" value="${engine.esn}"
                           placeholder="XXXXXX" />
                     </label>
                     <label class="block mt-4 text-sm">
                        <span class="flex-rows text-gray-700 dark:text-gray-400">Engine Type</span>
                        <div class="flex flex-cols space-x-2">
                           <select id="type"
                              class="block mt-1 text-sm dark:text-gray-300 dark:border-green-600 dark:bg-gray-700 form-select focus:border-green-400 focus:outline-none focus:shadow-outline-green dark:focus:shadow-outline-green">
                           </select>
                           <input id="config" required
                              class="block w-full mt-1 text-sm dark:border-green-600 dark:bg-gray-700 focus:border-green-400 focus:outline-none focus:shadow-outline-green dark:text-gray-300 dark:focus:shadow-outline-green form-input" value="${engine.config}"
                              placeholder="Config" />
                        </div>
                     </label>
                     <label class="block mt-4 text-sm">
                        <span class="text-gray-700 dark:text-gray-400">Customer</span>
                        <select id="customer"
                           class="block w-full mt-1 text-sm dark:text-gray-300 dark:border-green-600 dark:bg-gray-700 form-select focus:border-green-400 focus:outline-none focus:shadow-outline-green dark:focus:shadow-outline-green"> 
                        </select>
                     </label>
                     <label class="block mt-4 text-sm">
                        <span class="text-gray-700 dark:text-gray-400">Status</span>
                        <select id="status"
                           class="block w-full mt-1 text-sm dark:text-gray-300 dark:border-green-600 dark:bg-gray-700 form-select focus:border-green-400 focus:outline-none focus:shadow-outline-green dark:focus:shadow-outline-green"> selected="${engine.status}"
                        </select>
                     </label>
                     <label class="block mt-4 text-sm">
                        <span class="text-gray-700 dark:text-gray-400">Date in</span>
                        <input id="dateIn" type="date"
                           class="block w-full mt-1 text-sm dark:border-green-600 dark:bg-gray-700 focus:border-green-400 focus:outline-none focus:shadow-outline-green dark:text-gray-300 dark:focus:shadow-outline-green form-input" value="${engine.dateIn}"
                           placeholder="Date in" />
                     </label>
                     <label class="block mt-4 text-sm">
                        <span class="text-gray-700 dark:text-gray-400">Last Preserve Date</span>
                        <input id="preserve_date" type="date"
                           class="block w-full mt-1 text-sm dark:border-green-600 dark:bg-gray-700 focus:border-green-400 focus:outline-none focus:shadow-outline-green dark:text-gray-300 dark:focus:shadow-outline-green form-input" value="${engine.preserve_date}"
                           placeholder="Last Preserve Date" />
                     </label>
                     <label class="block mt-4 text-sm">
                        <span class="text-gray-700 dark:text-gray-400">Preservation Type</span>
                        <select id="preserve_type"
                           class="block w-full mt-1 text-sm dark:text-gray-300 dark:border-green-600 dark:bg-gray-700 form-select focus:border-green-400 focus:outline-none focus:shadow-outline-green dark:focus:shadow-outline-green">
                           <option ${engine.preserve_type == 90 ? "selected" : ""} value="90">90 Days</option>
                           <option ${engine.preserve_type == 180 ? "selected" : ""} value="180">180 Days</option>
                           <option ${engine.preserve_type == 365 ? "selected" : ""} value="365">365 Days</option>
                        </select>
                     </label>
                     <label class="block mt-4 text-sm">
                        <span class="text-gray-700 dark:text-gray-400">Reason</span>
                        <textarea id="reason"
                           class="block w-full mt-1 text-sm dark:border-green-600 dark:bg-gray-700 focus:border-green-400 focus:outline-none focus:shadow-outline-green dark:text-gray-300 dark:focus:shadow-outline-green form-input"
                           placeholder="Reason">${engine.reason}</textarea>
                     </label>
                  </div>
               </div>

               <div id="right block">
                  <!-- Storage Information Selector -->
                  <h4 class="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">
                     Storage Information
                  </h4>
                  <div class="px-4 py-3 mb-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
                     <label class="block text-sm">
                        <span class="text-gray-700 dark:text-gray-400">
                           Storage Type
                        </span>
                        <select id="s_type" onchange="switchForm()"
                           class="block w-full mt-1 text-sm dark:text-gray-300 dark:border-green-600 dark:bg-gray-700 form-select focus:border-green-400 focus:outline-none focus:shadow-outline-green dark:focus:shadow-outline-green">
                           <option ${engine.storage.s_type == "ETS" ? "selected" : ""} value="ETS">Transportation Stand</option>
                           <option ${engine.storage.s_type == "EPS" ? "selected" : ""} value="EPS">Pedestal</option>
                           <option ${engine.storage.s_type == "EGS" ? "selected" : ""} value="EGS">Gantry</option>
                        </select>
                     </label>
                  </div>

                  <!-- Transportation Stand Form -->
                  <div id="ETSForm"
                     class="px-4 py-3 mb-4 bg-white rounded-lg shadow-md dark:bg-gray-800 ${engine.storage.s_type == "ETS" ? "" : "hidden"}">
                     <label class="block text-sm">
                        <span class="text-gray-700 dark:text-gray-400">Base Part Number</span>
                        <input id="basePN"
                           class="block w-full mt-1 text-sm dark:border-green-600 dark:bg-gray-700 focus:border-green-400 focus:outline-none focus:shadow-outline-green dark:text-gray-300 dark:focus:shadow-outline-green form-input"
                           placeholder="Base Part Number" />
                     </label>
                     <label class="block mt-4 text-sm">
                        <span class="text-gray-700 dark:text-gray-400">Base Serial Number</span>
                        <input id="baseSN"
                           class="block w-full mt-1 text-sm dark:border-green-600 dark:bg-gray-700 focus:border-green-400 focus:outline-none focus:shadow-outline-green dark:text-gray-300 dark:focus:shadow-outline-green form-input"
                           placeholder="Base Serial Number" />
                     </label>
                     <label class="block mt-4 text-sm">
                        <span class="text-gray-700 dark:text-gray-400">cradle Part Number</span>
                        <input id="cradlePN"
                           class="block w-full mt-1 text-sm dark:border-green-600 dark:bg-gray-700 focus:border-green-400 focus:outline-none focus:shadow-outline-green dark:text-gray-300 dark:focus:shadow-outline-green form-input"
                           placeholder="cradle Part Number" />
                     </label>
                     <label class="block mt-4 text-sm">
                        <span class="text-gray-700 dark:text-gray-400">cradle Serial Number</span>
                        <input id="cradleSN"
                           class="block w-full mt-1 text-sm dark:border-green-600 dark:bg-gray-700 focus:border-green-400 focus:outline-none focus:shadow-outline-green dark:text-gray-300 dark:focus:shadow-outline-green form-input"
                           placeholder="cradle Serial Number" />
                     </label>
                     <label class="block mt-4 text-sm">
                        <span class="text-gray-700 dark:text-gray-400">Owner</span>
                        <input id="owner"
                           class="block w-full mt-1 text-sm dark:border-green-600 dark:bg-gray-700 focus:border-green-400 focus:outline-none focus:shadow-outline-green dark:text-gray-300 dark:focus:shadow-outline-green form-input"
                           placeholder="Owner" />
                     </label>
                     <label class="block mt-4 text-sm">
                        <span class="text-gray-700 dark:text-gray-400">Remark</span>
                        <input id="remark"
                           class="block w-full mt-1 text-sm dark:border-green-600 dark:bg-gray-700 focus:border-green-400 focus:outline-none focus:shadow-outline-green dark:text-gray-300 dark:focus:shadow-outline-green form-input"
                           placeholder="Remark" />
                     </label>
                  </div>

                  <!-- Gantry Form -->
                  <div id="EGSForm" class="px-4 py-3 mb-4 bg-white rounded-lg shadow-md dark:bg-gray-800 ${engine.storage.s_type == "EGS" ? "" : "hidden"}">
                     <label class="block text-sm">
                        <span class="text-gray-700 dark:text-gray-400">
                           Pick Gantry
                        </span>
                        <select id="gantryNum"
                           class="block w-full mt-1 text-sm dark:text-gray-300 dark:border-green-600 dark:bg-gray-700 form-select focus:border-green-400 focus:outline-none focus:shadow-outline-green dark:focus:shadow-outline-green">
                           <option ${engine.storage.s_detail == "Gantry 1" ? "selected" : ""} value="Gantry 1">Gantry 1</option>
                           <option ${engine.storage.s_detail == "Gantry 2" ? "selected" : ""} value="Gantry 2">Gantry 2</option>
                           <option ${engine.storage.s_detail == "Gantry 3" ? "selected" : ""} value="Gantry 3">Gantry 3</option>
                           <option ${engine.storage.s_detail == "Gantry 4" ? "selected" : ""} value="Gantry 4">Gantry 4</option>
                           <option ${engine.storage.s_detail == "Gantry 5" ? "selected" : ""} value="Gantry 5">Gantry 5</option>
                           <option ${engine.storage.s_detail == "Gantry 6" ? "selected" : ""} value="Gantry 6">Gantry 6</option>
                        </select>
                     </label>
                  </div>
               </div>
            </form>
            </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Update'
   }).then((result) => {
      if (result.isConfirmed) {
         updateData(int.id)
      }
   })
}

function updateData(id) {
   let esn = document.getElementById('esnForm').value
   let type = document.getElementById('type').value
   let config = document.getElementById('config').value
   let customer = document.getElementById('customer').value
   let status = document.getElementById('status').value
   let dateIn = document.getElementById('dateIn').value
   let preserve_date = document.getElementById('preserve_date').value
   let preserve_type = document.getElementById('preserve_type').value
   let reason = document.getElementById('reason').value
   let s_type = document.getElementById('s_type').value
   let gantryNum = document.getElementById('gantryNum').value

   enginelist.child('/' + id + '/esn').set(esn)
   enginelist.child('/' + id + '/type').set(type)
   enginelist.child('/' + id + '/config').set(config)
   enginelist.child('/' + id + '/customer').set(customer)
   enginelist.child('/' + id + '/status').set(status)
   enginelist.child('/' + id + '/dateIn').set(dateIn)
   enginelist.child('/' + id + '/preserve_date').set(preserve_date)
   enginelist.child('/' + id + '/preserve_type').set(preserve_type)
   enginelist.child('/' + id + '/reason').set(reason)
   if (s_type == 'EPS') {
      enginelist.child('/' + id + '/storage/s_type').set(s_type)
      enginelist.child('/' + id + '/storage/s_detail').set("Engine Pedestal")
   } else if (s_type == 'EGS') {
      enginelist.child('/' + id + '/storage/s_type').set(s_type)
      enginelist.child('/' + id + '/storage/s_detail').set(gantryNum)
   } else if (s_type == 'ETS') {

   }
}


window.switchForm = function switchForm() {
   // get parent of storage type form element
   let storageType = document.getElementById('s_type')

   // get type of storage choosed by user
   let ETSForm = document.getElementById('ETSForm')
   let EGSForm = document.getElementById('EGSForm')

   // using switch for DOM storage type form
   switch (storageType.value) {
      case "ETS":
         ETSForm.classList.remove("hidden");
         EGSForm.classList.add("hidden");
         break;
      case "EGS":
         ETSForm.classList.add("hidden");
         EGSForm.classList.remove("hidden");
         break;
      case "EPS":
         ETSForm.classList.add("hidden");
         EGSForm.classList.add("hidden");
         break;
   }
}

window.set = function set(storage, customer, status, type) {

   let i = 0
   enginetype.once('value', function (d) {
      d.forEach(t => {
         let type = document.getElementById('type')
         let option = document.createElement("option")
         option.text = t.val().type
         option.value = t.val().type
         type.add(option, type[i])
         i++
      });
      document.getElementById('type').value = type
   })

   customerlist.once('value', function (d) {
      d.forEach(t => {
         let type = document.getElementById('customer')
         let option = document.createElement("option")
         option.text = t.val()
         option.value = t.key
         type.add(option, type[i])
         i++
      });
      document.getElementById('customer').value = customer
   })

   statuslist.once('value', function (d) {
      d.forEach(t => {
         let type = document.getElementById('status')
         let option = document.createElement("option")
         option.text = t.val()
         option.value = t.key
         type.add(option, type[i])
         i++
      });
      document.getElementById('status').value = status
      console.log(status)
   })

   storagelist.child(storage).once('value', function (d) {
      if (d.exists()) {
         let basePN = document.getElementById('basePN')
         let baseSN = document.getElementById('baseSN')
         let cradlePN = document.getElementById('cradlePN')
         let cradleSN = document.getElementById('cradleSN')
         let owner = document.getElementById('owner')
         let remark = document.getElementById('remark')
         basePN.value = d.val().basePN
         baseSN.value = d.val().baseSN
         cradlePN.value = d.val().cradlePN
         cradleSN.value = d.val().cradleSN
         owner.value = d.val().owner
         remark.value = d.val().basePN
      }
   })

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
   let element = document.getElementById('engine-table');
   let opt = {
      margin: 1,
      filename: 'Report.pdf',
      image: { type: 'png', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' }
   };
   html2pdf().set(opt).from(element).save();
}