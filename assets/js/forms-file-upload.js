/**
 * File Upload
 */

'use strict';

let stylePreference = '';

document.querySelectorAll('input[name="stylePreference"]').forEach((elem) => {
  elem.addEventListener("change", function() {
    const textInput = document.querySelector('input[id="customStyleInput"]');
    if (this.id === "customStyleInput") {
      stylePreference = textInput.value
    } else {
      stylePreference = this.value
    }
  });
});

(function () {
  // previewTemplate: Updated Dropzone default previewTemplate
  // ! Don't change it unless you really know what you are doing
  const previewTemplate = `<div class="dz-preview dz-file-preview">
<div class="dz-details">
  <div class="dz-thumbnail">
    <img data-dz-thumbnail>
    <span class="dz-nopreview">No preview</span>
    <div class="dz-success-mark"></div>
    <div class="dz-error-mark"></div>
    <div class="dz-error-message"><span data-dz-errormessage></span></div>
    <div class="progress">
      <div class="progress-bar progress-bar-primary" role="progressbar" aria-valuemin="0" aria-valuemax="100" data-dz-uploadprogress></div>
    </div>
  </div>
  <div class="dz-filename" data-dz-name></div>
  <div class="dz-size" data-dz-size></div>
</div>
</div>`;



  // Jacky Customization Section
//------------------------------------------------------------------
// add dropzone image upload form
// Dev Server - http://43.156.113.40:7860/
// const ai_image_api = 'http://43.156.113.40:7860/sdapi/v1/txt2img';
// const ai_image_api = "http://localhost:8000/aibros/api/images/";
const ai_image_api = "http://34.127.31.198:8080/aibros/api/images/";
// const ai_image_api = "http://10.138.0.2:8080/aibros/api/images/";

const loading_spinner = document.getElementById('loading_spinner');
const image_input_test = document.getElementById('upload-image-text');
const submitButton = document.getElementById('submit-image');
 
const myDropzone = new Dropzone('#dropzone-user-input-image', {
  addRemoveLinks: true,
  maxFiles: 5,
  autoProcessQueue:false,
  previewTemplate: previewTemplate,
  maxFiles: 1,
  url: ai_image_api
});

 // Function to handle UI changes during fetch call
 function handleButtonUI(isLoading) {
  if(isLoading) {
    loading_spinner.classList.remove('visually-hidden');
    image_input_test.classList.add('visually-hidden');
    submitButton.disabled = true;
  } else {
    loading_spinner.classList.add('visually-hidden');
    image_input_test.classList.remove('visually-hidden');
    submitButton.disabled = false;
  }
}


// Trigger file upload when button is clicked
submitButton.addEventListener("click", function(e) {
  handleButtonUI(true);
  
  //upload image to server and get it back
  let file = myDropzone.files[0];
  // Convert file to Base64
  let reader = new FileReader();


  reader.onloadend = function (e) {

      let image_code_for_ctrlnet = reader.result.split(',')[1]; // Removes 'data:image/png;base64,' from the string
      // Prepare your JSON data
      let data = {
        user: '1', //dummy user id, change it when we add user login feature
        uploaded_image: image_code_for_ctrlnet,
        style_prompt: stylePreference
      };

      // Convert JSON object to string
      let jsonData = JSON.stringify(data);

      // Use Fetch API or another AJAX method to send the JSON data to the server
      fetch(ai_image_api, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: jsonData
      }).then(response => response.json()).then(
        data => {
          if (data && data.images) {
            let base64Image = 'data:image/jpeg;base64,' + data.images;
            let imgElement = document.getElementById('generatedImage');
            imgElement.src = base64Image;
            console.log("File uploaded successfully");
            handleButtonUI(false);
          } else {
            throw new Error("Image data not found in server response.");
          }
        }
      )
      .catch(error => {
          // Handle the error
          console.log("File upload failed. Error Message: ", error);
          handleButtonUI(false);
      });
  };
  reader.readAsDataURL(file);
  //myDropzone.processQueue();
});

myDropzone.on("addedfile", function(file) {
  submitButton.disabled = false;
  console.log("Added file");
});


myDropzone.on("sending", function(file, xhr, formData) {
  console.log("Sending: ");
});

/* myDropzone.on("processing", function(file) {
  console.log("Uploading");
}); */

// Success event
myDropzone.on("success", function(file, response) {
  console.log("Image Generate successfully. Server Response: ", response);
  loading_spinner.classList.add('visually-hidden');  // Hide the spinner
  image_input_test.classList.remove('visually-hidden');
  submitButton.disabled = false;
  myDropzone.removeAllFiles(true);
});

// Error event
myDropzone.on("error", function(file, errorMessage) {
  console.log("File upload failed. Error Message: ", errorMessage);
  handleUI(false);
});

})();




  // Sample Code for reference

  // Basic Dropzone
  // --------------------------------------------------------------------
/*   const dropzoneBasic = document.querySelector('#dropzone-basic');
  if (dropzoneBasic) {
    const myDropzone = new Dropzone(dropzoneBasic, {
      previewTemplate: previewTemplate,
      parallelUploads: 1,
      maxFilesize: 5,
      addRemoveLinks: true,
      maxFiles: 1
    });
  } */

  // Multiple Dropzone
  // --------------------------------------------------------------------
/*   const dropzoneMulti = document.querySelector('#dropzone-multi');
  if (dropzoneMulti) {
    const myDropzoneMulti = new Dropzone(dropzoneMulti, {
      previewTemplate: previewTemplate,
      parallelUploads: 1,
      maxFilesize: 5,
      addRemoveLinks: true
    });
  } */