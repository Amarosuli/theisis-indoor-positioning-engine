import {
    storagelist, enginelist
} from '../database/db.js'
import { excel } from '../external/Excel.js'

// get Data
storagelist.on('value', function (data) {
    const svgs = document.getElementById('target-data')
    let render = ''
    let sizeData = data.numChildren()
    document.getElementById('length-data').innerText = `Showing ${sizeData} of ${sizeData}`
    data.forEach(function (data) {
        var customer = data.val()
        var usedByResolve
        var usedBy
        enginelist.child(customer.usedBy).get().then((snapshot) => {
            if (snapshot.exists()) {
                usedBy = snapshot.val().esn
            } else {
                usedBy = 'No Data'
            }
        })
        render += `
        <tr class="text-gray-700 dark:text-gray-400 ">
            <td class="px-4 py-3 text-xs">${customer.owner}</td>
            <td class="px-4 py-3 text-xs">
            <div> <span class="px-2 py-1 font-semibold">PN: ${customer.basePN} </span> </div>
            <div> <span class="px-2 py-1 leading-tight text-gray-600 dark:text-gray-400">SN: ${customer.baseSN} </span> </div>
            </td>
            <td class="px-4 py-3 text-xs">
            <div> <span class="px-2 py-1 font-semibold">PN: ${customer.cradlePN} </span> </div>
            <div> <span class="px-2 py-1 leading-tight text-gray-600 dark:text-gray-400">SN: ${customer.cradleSN} </span> </div>
            <td class="px-4 py-3 text-xs">${customer.remark}</td>
            <td class="px-4 py-3 text-xs">${customer.s_type}</td>
            <td class="px-4 py-3 text-xs">${usedBy}</td>
            <td class="px-4 py-3">
                <div class="flex items-center space-x-4 text-sm" id="${data.key}">
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

// export to Excel
document.getElementById('export-table').addEventListener("click", function (e) {
    excel.set('engine-table', 'storage-list')
    excel.export()
})

// add data
window.add = function add() {
    // let int = value.parentElement.parentElement.parentElement
    // var storage
    // storagelist.child(int.id).once('value', function(d) {
    //     storage = d.val()
    //     console.log(storage)
    // })

    // set(customer.storage.s_detail, customer.customer, customer.status, customer.type)


    Swal.fire({
        width: 500,
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
       <div id="">
       <form id="engineForm" class="w-full justify-center pt-6" autocomplete="off">
        <div id="right block">
        <!-- Storage Information Selector -->
        <h4 class="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">
            Add New Storage
        </h4>
        <div class="px-4 py-3 mb-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <label class="block text-sm">
                <span class="text-gray-700 dark:text-gray-400">
                    Storage Type
                </span>
                <select required id="s_type" class="block w-full mt-1 text-sm dark:text-gray-300 dark:border-green-600 dark:bg-gray-700 form-select focus:border-green-400 focus:outline-none focus:shadow-outline-green dark:focus:shadow-outline-green">
                    <option value="ETS" selected>Transportation Stand</option>
                </select>
            </label>
        </div>
        <!-- Transportation Stand Form -->
        <div id="ETSForm" class="px-4 py-3 mb-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <label class="block text-sm">
                <span class="text-gray-700 dark:text-gray-400">Base Part Number</span>
                <input id="basePN" class="block w-full mt-1 text-sm dark:border-green-600 dark:bg-gray-700 focus:border-green-400 focus:outline-none focus:shadow-outline-green dark:text-gray-300 dark:focus:shadow-outline-green form-input" placeholder="Base Part Number" />
            </label>
            <label class="block mt-4 text-sm">
                <span class="text-gray-700 dark:text-gray-400">Base Serial Number</span>
                <input id="baseSN" class="block w-full mt-1 text-sm dark:border-green-600 dark:bg-gray-700 focus:border-green-400 focus:outline-none focus:shadow-outline-green dark:text-gray-300 dark:focus:shadow-outline-green form-input" placeholder="Base Serial Number" />
            </label>
            <label class="block mt-4 text-sm">
                <span class="text-gray-700 dark:text-gray-400">cradle Part Number</span>
                <input id="cradlePN" class="block w-full mt-1 text-sm dark:border-green-600 dark:bg-gray-700 focus:border-green-400 focus:outline-none focus:shadow-outline-green dark:text-gray-300 dark:focus:shadow-outline-green form-input" placeholder="cradle Part Number" />
            </label>
            <label class="block mt-4 text-sm">
                <span class="text-gray-700 dark:text-gray-400">cradle Serial Number</span>
                <input id="cradleSN" class="block w-full mt-1 text-sm dark:border-green-600 dark:bg-gray-700 focus:border-green-400 focus:outline-none focus:shadow-outline-green dark:text-gray-300 dark:focus:shadow-outline-green form-input" placeholder="cradle Serial Number" />
            </label>
            <label class="block mt-4 text-sm">
                <span class="text-gray-700 dark:text-gray-400">Owner</span>
                <input id="owner" class="block w-full mt-1 text-sm dark:border-green-600 dark:bg-gray-700 focus:border-green-400 focus:outline-none focus:shadow-outline-green dark:text-gray-300 dark:focus:shadow-outline-green form-input" placeholder="Owner" />
            </label>
            <label class="block mt-4 text-sm">
                <span class="text-gray-700 dark:text-gray-400">Remark</span>
                <input id="remark" class="block w-full mt-1 text-sm dark:border-green-600 dark:bg-gray-700 focus:border-green-400 focus:outline-none focus:shadow-outline-green dark:text-gray-300 dark:focus:shadow-outline-green form-input" placeholder="Remark" />
            </label>
        </div>
    </div>
    </div>
        </form>
         </div>
       `,
        showCancelButton: true,
        confirmButtonText: 'Save'
    }).then((result) => {
        if (result.isConfirmed) {
            let basePN = document.getElementById('basePN').value
            let baseSN = document.getElementById('baseSN').value
            let cradlePN = document.getElementById('cradlePN').value
            let cradleSN = document.getElementById('cradleSN').value
            let owner = document.getElementById('owner').value
            let remark = document.getElementById('remark').value
            addData(basePN, baseSN, cradlePN, cradleSN, owner, remark)
        } else {
            document.getElementById('engineForm').reset()
        }
    })
}

// remove data
window.remove = function remove(value) {
    let int = value.parentElement.parentElement.parentElement
    console.log(value.parentElement)
    let del = customerlist.child(int.id)
    Swal.fire({
        width: 400,
        title: `Delete Customer "${value.parentElement.id}" ?`,
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
                title: `Customer ${value.parentElement.id} Removed!`,
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
    var storage
    storagelist.child(int.id).once('value', function (d) {
        storage = d.val()
        console.log(storage)
    })

    // set(customer.storage.s_detail, customer.customer, customer.status, customer.type)

    Swal.fire({
        width: 500,
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
       <form id="engineForm" class="w-full justify-center pt-6" autocomplete="off">
                <div id="left block">
                   <!-- General Engine Information -->
                   <h4 class="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">
                      Customer Information
                   </h4>
                   <div class="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
                      <label class="block mt-4 text-sm">
                         <span class="text-gray-700 dark:text-gray-400">Customer Name</span>
                         <input id="customer-name" required
                            class="block w-full mt-1 text-sm dark:border-green-600 dark:bg-gray-700 focus:border-green-400 focus:outline-none focus:shadow-outline-green dark:text-gray-300 dark:focus:shadow-outline-green form-input" value="${customer}"
                            placeholder="${customer}" />
                      </label>
                      <label class="block mt-4 text-sm">
                         <span class="text-gray-700 dark:text-gray-400">Customer Code</span>
                         <input id="customer-code" required
                            class="block w-full mt-1 text-sm dark:border-green-600 dark:bg-gray-700 focus:border-green-400 focus:outline-none focus:shadow-outline-green dark:text-gray-300 dark:focus:shadow-outline-green form-input" value="${int.id}"
                            placeholder="${int.id}" />
                      </label>
                      <label class="block mt-4 text-sm">
                         <span class="text-gray-700 dark:text-gray-400">Logo</span>
                         <input id="logo" type="file"
                            class="block w-full mt-1 text-sm dark:border-green-600 dark:bg-gray-700 focus:border-green-400 focus:outline-none focus:shadow-outline-green dark:text-gray-300 dark:focus:shadow-outline-green form-input"
                            placeholder="Logo" accept="image/png" />
                      </label>
                        <div class="relative flex items-center justify-center w-full mr-3 mt-4 rounded">
                            <img class="object-contain w-40 h-40 rounded p-2 "
                                src="/public/img/company/${int.id}.png" alt="${customer}" loading="lazy" />
                            <div class="absolute inset-0 rounded shadow-inner" aria-hidden="true"></div>
                        </div>
                   </div>
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

function addData(basePN, baseSN, cradlePN, cradleSN, owner, remark) {
    let newStorage = storagelist.push() // push function need for auto generate id or key
    Swal.fire({
        width: 400,
        height: 600,
        title: 'Are you sure?',
        showCancelButton: true,
        confirmButtonText: `Yes`,
    }).then((result) => {
        if (result.isConfirmed) {
            console.log(basePN, baseSN, cradlePN, cradleSN, owner, remark)
            // newStorage.set({
            //     s_type: 'ETS',
            //     usedBy: '',
            //     basePN: basePN,
            //     baseSN: baseSN,
            //     cradlePN: cradlePN,
            //     cradleSN: cradleSN,
            //     owner: owner,
            //     remark: remark
            // })
            Swal.fire({
                width: 400,
                height: 600,
                icon: 'success',
                title: `Saved!`,
                showConfirmButton: false,
                customClass: {
                    icon: 'text-xs',
                }
            })
        } else if (result.isCancel) {
            window.add()
        }
    })
}
function updateData(id) {
    let customername = document.getElementById('customer-name').value
    let customercode = document.getElementById('customer-code').value
    let logo = document.getElementById('logo').file

    customerlist.child('/').set(customername)
    customerlist.child('/').set(customername)
    customerlist.child('/').set(customername)
    enginelist.child('/' + id + '/esn').set(esn)

}