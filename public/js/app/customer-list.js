import {
    customerlist
} from '../database/db.js'
import {excel} from '../external/Excel.js'


// get Data
customerlist.on('value', function(data) {
    const svgs = document.getElementById('target-data')
    let render = ''
    let sizeData = data.numChildren()
    document.getElementById('length-data').innerText = `Showing ${sizeData} of ${sizeData}`
    data.forEach(function(data) {
        var customer = data.val()
        render += `
        <tr class="text-gray-700 dark:text-gray-400 " id="${data.key}">
            <td class="px-4 py-3 text-xs">${customer}</td>
            <td class="px-4 py-3 text-xs">${data.key}</td>
            <td class="px-4 py-3">
                <div class="flex items-center text-xs">
                    <div class="relative block w-8 h-8 mr-3 rounded">
                        <img class="object-contain w-full h-full rounded"
                            src="/public/img/company/${data.key}.png" alt="${customer}" loading="lazy" />
                        <div class="absolute inset-0 rounded shadow-inner" aria-hidden="true"></div>
                    </div>
                </div>
            </td>
            <td class="px-4 py-3">
                <div class="flex items-center space-x-4 text-sm" id="${customer}">
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
document.getElementById('export-table').addEventListener("click", function(e) {
    excel.set('engine-table', 'customer-list')
    excel.export()

})

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

// add data
window.add = function add() {

    // let int = value.parentElement.parentElement.parentElement
    // var customer
    // customerlist.child(int.id).once('value', function(d) {
    //     customer = d.val()
    //     console.log(customer)
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
                <div id="left block">
                   <!-- General Engine Information -->
                   <h4 class="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">
                      Add New Customer
                   </h4>
                   <div class="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
                      <label class="block mt-4 text-sm">
                         <span class="text-gray-700 dark:text-gray-400">Customer Name</span>
                         <input id="customer-name" required
                            class="block w-full mt-1 text-sm dark:border-green-600 dark:bg-gray-700 focus:border-green-400 focus:outline-none focus:shadow-outline-green dark:text-gray-300 dark:focus:shadow-outline-green form-input" value=""
                            placeholder="" />
                      </label>
                      <label class="block mt-4 text-sm">
                         <span class="text-gray-700 dark:text-gray-400">Customer Code</span>
                         <input id="customer-code" required
                            class="block w-full mt-1 text-sm dark:border-green-600 dark:bg-gray-700 focus:border-green-400 focus:outline-none focus:shadow-outline-green dark:text-gray-300 dark:focus:shadow-outline-green form-input" value=""
                            placeholder="" />
                      </label>
                      <label class="block mt-4 text-sm">
                         <span class="text-gray-700 dark:text-gray-400">Logo</span>
                         <input id="logo" type="file"
                            class="block w-full mt-1 text-sm dark:border-green-600 dark:bg-gray-700 focus:border-green-400 focus:outline-none focus:shadow-outline-green dark:text-gray-300 dark:focus:shadow-outline-green form-input"
                            placeholder="Logo" accept="image/png" />
                      </label>
                        <div class="relative flex items-center justify-center w-full mr-3 mt-4 rounded hidden">
                            <img class="object-contain w-40 h-40 rounded p-2 "
                                src="" alt="" loading="lazy" />
                            <div class="absolute inset-0 rounded shadow-inner" aria-hidden="true"></div>
                        </div>
                   </div>
                </div>

                </div>
             </form>
             </div>
       `,
        showCancelButton: true,
        confirmButtonText: 'Save Data'
    }).then((result) => {
        if (result.isConfirmed) {
            addData()
        }
    })
}

// edit data
window.edit = function edit(value) {
    let int = value.parentElement.parentElement.parentElement
    var customer
    customerlist.child(int.id).once('value', function(d) {
        customer = d.val()
        console.log(customer)
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

function updateData(id) {
    let customername = document.getElementById('customer-name').value
    let customercode = document.getElementById('customer-code').value
    let logo = document.getElementById('logo').file

    if (id !== customercode) {
        console.log('new code is', customercode)

        // rename file logo
        // data di hapus, dan create baru
    } else if (id == customercode) {
        // langsung ganti aja
        customerlist.child('/' + id).set(customername)
    }
}

function addData() {
    let customername = document.getElementById('customer-name').value
    let customercode = document.getElementById('customer-code').value
    let logo = document.getElementById('logo').files

    console.log(customername, customercode, logo)
}