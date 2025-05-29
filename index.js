/* Helper function to render the file using PDF Embed API. */
function previewFile(filePromise, fileName) {
    /* Initialize the AdobeDC View object */
    var adobeDCView = new AdobeDC.View({
        /* Pass your registered client id */
        clientId: "30d33487c7c24fa793442d5d281a8dfb",
        /* Pass the div id in which PDF should be rendered */
        divId: "adobe-dc-view",
    });

    /* Invoke the file preview API on Adobe DC View object */
    adobeDCView.previewFile({
        /* Pass information on how to access the file */
        content: {
            /* pass file promise which resolve to arrayBuffer */
            promise: filePromise,
        },
        /* Pass meta data of file */
        metaData: {
            /* file name */
            fileName: fileName
        }
    }, {
        /* Embed Mode. Options: FullWindow, SizedContainer, InLine */
        embedMode: "FULL_WINDOW"
    });
}

// Helper function to convert Base64 string to ArrayBuffer
function base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

/*
* Function to be called from Android native code.
* fileDataAsBase64: The PDF file content encoded as a Base64 string.
* fileName: The name of the file.
*/
function loadPdfFromNative(fileDataAsBase64, fileName) {
    // Clear any previous error messages or content if necessary
    document.getElementById("adobe-dc-view").innerHTML = "";
    document.getElementById("status-message").textContent = "Loading PDF...";


    if (!fileDataAsBase64 || !fileName) {
        console.error("File data or file name is missing.");
        document.getElementById("status-message").textContent = "Error: File data or name missing.";
        return;
    }

    // Basic check for PDF extension on the filename, though stronger validation might be done natively.
    if (fileName.toLowerCase().lastIndexOf(".pdf") !== fileName.length - 4) {
        console.warn("The selected file might not be a PDF based on its name: " + fileName);
        // You might still try to load it or show a warning
    }

    try {
        const arrayBuffer = base64ToArrayBuffer(fileDataAsBase64);
        const filePromise = Promise.resolve(arrayBuffer);
        previewFile(filePromise, fileName);
        document.getElementById("status-message").textContent = "Previewing: " + fileName;
    } catch (error) {
        console.error("Error processing PDF data: ", error);
        document.getElementById("adobe-dc-view").innerHTML =
            "<div style='color: red; padding: 20px;'>Error loading PDF viewer: " + error.message +
            "<br>Ensure your Client ID is correct and the domain is registered with Adobe.</div>";
        document.getElementById("status-message").textContent = "Error loading PDF.";
    }
}
