const db = firebase.firestore();

db.collection('keyboard-colors')
    .doc('current')
    .onSnapshot(function(doc) {
        const d = doc.data();
        for(const a of Object.keys(d)) {
            let el = document.querySelector(`#key-${a}`);
            if(el) el.style.backgroundColor = `#${d[a].replace("#", "")}`;
        }
    });