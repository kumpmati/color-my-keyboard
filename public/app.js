const db = firebase.firestore();
const colorDataRef = db.collection('keyboard-colors').doc('current');

let keyColors;
let updateBatch = {};

// batch updates within 500 ms from each other to a single write
var sendUpdates = debounce(function() {
    const updateCopy = JSON.parse(JSON.stringify(updateBatch));
    updateBatch = {};
    // send new colors to db
    colorDataRef.update(updateCopy)
        .catch(e => console.error(e));
}, 750);

// debounce utility function
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

// color picker
const colorPicker = document.querySelector("#color-picker");
colorPicker.value = localStorage.getItem("colorpicker-color") || "#32a852";
colorPicker.addEventListener('change', () => localStorage.setItem("colorpicker-color", colorPicker.value));

// update color data when db updates
colorDataRef.onSnapshot(setKeyColors);

// function to update on-screen keyboard colors based on color data
function setKeyColors(doc) {
    if(!doc.data) return;
    // parse data from doc
    keyColors = doc.data();
    for(const keyName of Object.keys(keyColors)) {
        const keyElement = document.querySelector(`#key-${keyName}`);
        if(keyElement) {
            const col = `#${keyColors[keyName] ? keyColors[keyName].replace("#", "") : "000"}`;
            keyElement.style.color = col;
            keyElement.style.borderColor = col;
        }
    }
}

document.querySelector("#keyboard").addEventListener("click", function(e) {
    const targetElement = e.target;
    // check that target id matches a field in color data
    if(targetElement.classList.contains("key") && targetElement.id) {
        // get key name
        const keyName = targetElement.id.replace("key-", "");

        // update client-side color before db response to feel snappy
        targetElement.style.color = colorPicker.value;
        targetElement.style.borderColor = colorPicker.value;

        // add change to batch
        updateBatch[keyName] = colorPicker.value;
        // send batched updates to db
        sendUpdates();
    }
});