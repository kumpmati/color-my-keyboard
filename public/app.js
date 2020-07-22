const db = firebase.firestore();
/*
db.collection('keyboard-colors')
    .doc('current')
    .onSnapshot(function(doc) {
        console.log(doc.data());
    });
*/
db.collection('keyboard-colors')
    .doc('current')
    .set({
        "esc": "fff"
    });

const setColor = firebase.functions().httpsCallable('setColor');
/*
setColor({index: 1, hex: "fafafa"})
    .then(res => console.log(res));
*/