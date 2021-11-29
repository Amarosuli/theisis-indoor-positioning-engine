import {
   enginelist,
   enginetype,
   customerlist,
   statuslist,
   storagelist
} from '../database/db.js'

// Init Sweetalert
var Toast = Swal.mixin({
   toast: true,
   position: 'top-start',
   showConfirmButton: false,
   timer: 3000,
   timerProgressBar: true,
   didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
   }
})

document.getElementById('engineForm').onload = switchForm()
// CONTROL FORM 
window.switchForm = switchForm

function switchForm() {

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
      default:
         ETSForm.classList.add("hidden");
         EGSForm.classList.add("hidden");
   }
}

// CREATE DATA
// event handler for "save" button -- it call submitform function
document.getElementById('engineForm').addEventListener('submit', submitForm)

function submitForm(e) {
   e.preventDefault()

   // get value for main data
   let esn = document.getElementById('esn').value
   let type = document.getElementById('type').value
   let config = document.getElementById('config').value
   let customer = document.getElementById('customer').value
   let status = document.getElementById('status').value
   let dateIn = document.getElementById('dateIn').value
   let preserve_date = document.getElementById('preserve_date').value
   let preserve_type = document.getElementById('preserve_type').value
   let reason = document.getElementById('reason').value
   let s_type = document.getElementById('s_type').value

   switch (s_type) {
      case "EPS":
         saveEPS(esn, type, config, customer, status, dateIn, preserve_date, preserve_type, reason, s_type)
         break;

      case "EGS":
         let gantryNum = document.getElementById('gantryNum').value
         saveEGS(esn, type, config, customer, status, dateIn, preserve_date, preserve_type, reason, s_type, gantryNum)
         break;

      case "ETS":
         // get transportation identity
         let basePN = document.getElementById('basePN').value
         let baseSN = document.getElementById('baseSN').value
         let cradlePN = document.getElementById('cradlePN').value
         let cradleSN = document.getElementById('cradleSN').value
         let owner = document.getElementById('owner').value
         let remark = document.getElementById('remark').value

         saveETS(esn, type, config, customer, status, dateIn, preserve_date, preserve_type, reason, s_type, basePN, baseSN, cradlePN, cradleSN, owner, remark)
         break;
   }
}

// TRANSPORTATION STAND
function saveETS(esn, type, config, customer, status, dateIn, preserve_date, preserve_type, reason, s_type, basePN, baseSN, cradlePN, cradleSN, owner, remark) {
   let newData = enginelist.push() // push function need for auto generate id or key
   let newStorage = storagelist.push() // push function need for auto generate id or key
   Swal.fire({
      width: 400,
      height: 600,
      title: 'Are you sure?',
      showCancelButton: true,
      confirmButtonText: `Yes`,
   }).then((result) => {
      if (result.isConfirmed) {
         newData.set({
            esn: esn,
            type: type,
            config: config,
            customer: customer,
            status: status,
            dateIn: dateIn,
            preserve_date: preserve_date,
            preserve_type: preserve_type,
            reason: reason,
            storage: {
               s_type: s_type,
               s_detail: newStorage.key
            },
            location: "",
            shape: "face90",
            x: -649.691,
            y: 282.458
         })
         newStorage.set({
            s_type: s_type,
            usedBy: newData.key,
            basePN: basePN,
            baseSN: baseSN,
            cradlePN: cradlePN,
            cradleSN: cradleSN,
            owner: owner,
            remark: remark
         })
         Swal.fire({
            width: 400,
            height: 600,
            icon: 'success',
            title: `ESN ${esn} Saved!`,
            showConfirmButton: false,
            customClass: {
               icon: 'text-xs',
            }
         })
         // reset form
         document.getElementById('engineForm').reset()
         switchForm()
      } else if (result.isCancel) { }
   })
}

// Pedestal
function saveEPS(esn, type, config, customer, status, dateIn, preserve_date, preserve_type, reason, s_type) {
   let newData = enginelist.push() // push function need for auto generate id or key
   console.log(newData.key)
   Swal.fire({
      title: 'Are you sure?',
      showCancelButton: true,
      confirmButtonText: `Yes`,
   }).then((result) => {
      if (result.isConfirmed) {
         newData.set({
            esn: esn,
            type: type,
            config: config,
            customer: customer,
            status: status,
            dateIn: dateIn,
            preserve_date: preserve_date,
            preserve_type: preserve_type,
            reason: reason,
            storage: {
               s_type: s_type,
               s_detail: "Engine Pedestal"
            },
            location: "",
            shape: "face270",
            x: -649.691,
            y: 282.458
         })
         Swal.fire(`ESN ${esn} Saved!`, '', 'success')
         // reset form
         document.getElementById('engineForm').reset()
         switchForm()
      } else if (result.isCancel) { }
   })
}

// Gantry
function saveEGS(esn, type, config, customer, status, dateIn, preserve_date, preserve_type, reason, s_type, gantryNum) {
   let newData = enginelist.push() // push function need for auto generate id or key
   Swal.fire({
      title: 'Are you sure?',
      showCancelButton: true,
      confirmButtonText: `Yes`,
   }).then((result) => {
      if (result.isConfirmed) {
         newData.set({
            esn: esn,
            type: type,
            config: config,
            customer: customer,
            status: status,
            dateIn: dateIn,
            preserve_date: preserve_date,
            preserve_type: preserve_type,
            reason: reason,
            storage: {
               s_type: s_type,
               s_detail: gantryNum
            },
            location: "",
            shape: "face270",
            x: -649.691,
            y: 282.458
         })
         Swal.fire(`ESN ${esn} Saved!`, '', 'success')
         // reset form
         document.getElementById('engineForm').reset()
         switchForm()
      } else if (result.isCancel) { }
   })
}

// for form options and data
window.onload = function set() {
   enginetype.on('child_added', function (d) {
      let type = document.getElementById('type')
      let fill = document.createElement("option")
      fill.text = d.val().type
      fill.value = d.val().type
      type.options.add(fill, 1)

   })

   customerlist.on('child_added', function (d) {
      let type = document.getElementById('customer')
      let fill = document.createElement("option")
      fill.text = d.val()
      fill.value = d.key
      type.options.add(fill, 1)
   })

   statuslist.on('child_added', function (d) {
      let type = document.getElementById('status')
      let fill = document.createElement("option")
      fill.text = d.val()
      fill.value = d.key
      type.options.add(fill, 1)
   })
}

// QR Code
let video = document.getElementById('qr-reader');
let html5QrcodeScanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: 250 });

// Get access to the camera!
// if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//    // Not adding `{ audio: true }` since we only want video now
//    navigator.mediaDevices.getUserMedia({ video: {
//       width: { min: 1280 },
//       height: { min:720}
//    } }).then(function (stream) {
//       //video.src = window.URL.createObjectURL(stream);
//       video.srcObject = stream;
//    });
// }

function onScanSuccess(decodedText, decodedResult) {
   let json = JSON.parse(decodedText.replace(/'\'/, ''))
   
   html5QrcodeScanner.clear().then((ignore) => {
      let p = document.createElement('p')
      let btn = document.createElement('button')
      btn.innerText = 'Scan Again'
      btn.id = 'rescan'
      btn.setAttribute('class', 'px-4 py-2 justify-center text-sm font-medium leading-5 text-white transition-colors duration-150 bg-green-600 border border-transparent rounded-lg active:bg-green-600 hover:bg-green-700 focus:outline-none focus:shadow-outline-green')
      btn.addEventListener('click', (e) => {
         e.preventDefault()
         html5QrcodeScanner.render(onScanSuccess, onScanError);
      })
      p.innerText = json.esn
      video.appendChild(btn)
      video.appendChild(p)
   })
   // i think it was good if use template node
}

function onScanError(errorMessage) {
   console.log(errorMessage);
}

html5QrcodeScanner.render(onScanSuccess, onScanError);