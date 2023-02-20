document.addEventListener('DOMContentLoaded', () => {
    const pathArray = window.location.href;
    const allDataContent = document.createElement('div');
    const titleElem = document.querySelector('h1');

    fetchQRData(pathArray + 'api/qr/', 'temp QR`s', allDataContent);
    fetchQRData(pathArray + 'api/qr/ready/', 'ready QR`s', allDataContent);

    titleElem.insertAdjacentElement('afterend', allDataContent);
});

function fetchQRData(url, headerText, parentElem) { 
    let tempElem = document.createElement('div'); 
    let dataString = ''; 

    tempElem.innerHTML = `<h3>${headerText}</h3>`; 

    fetch(url) 
        .then((res) => res.json()) 
        .then((res) => { 
            res.forEach(qrObj => { 
                dataString += `<div>${JSON.stringify(qrObj, null, 4)}</div>\n` ; 
            }); 

            tempElem.innerHTML += dataString; 

            parentElem.appendChild(tempElem); 
        });  
}  