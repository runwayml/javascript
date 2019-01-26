window.SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
const recognition = new webkitSpeechRecognition();
recognition.lang = 'en';

recognition.addEventListener('result', (event) => {
    const text = event.results.item(0).item(0).transcript;
    document.getElementById('input').innerHTML = text;
    postData();
}, false);

// convert Base64 to image
const Base64ToImage = (base64img, callback) => {
    const img = new Image();
    img.onload = () => {
        callback(img);
    };
    img.src = base64img;
};

// send post request to Runway
const postData = async () => {
    // console.time("timer");
    const PORT = '8000'; // you may need to modify this
    const url = `http://localhost:${PORT}/query`;
    const text = document.getElementById('input').value
    
    // Runway requires data
    const input = {
        "caption": text
    };
    const settings = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
    };
    const data = await fetch(url, settings)
        .then(response => response.json())
        .then(json => {
            return json;
        })
        .catch(e => {
            return e
        });

    console.log(`base64 \n ${data.result}`);
    // console.timeEnd("timer");
    Base64ToImage(data.result, (img) => {
        document.getElementById('output').innerHTML = '';
        document.getElementById('output').appendChild(img);
    });
};

const record = () => {
    recognition.start();
};

const clearTextArea = () => {
    document.getElementById('input').value = "";
};