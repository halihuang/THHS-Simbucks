import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'


var firebaseConfig = {
apiKey: "AIzaSyCuiRotVrClHRuvJogrg6-jQBlm2md6rMc",
authDomain: "thhs-simbucks.firebaseapp.com",
databaseURL: "https://thhs-simbucks.firebaseio.com",
projectId: "thhs-simbucks",
storageBucket: "thhs-simbucks.appspot.com",
messagingSenderId: "964034630656",
appId: "1:964034630656:web:5e1c337bcfe52f399c74e5"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// utils
const db = firebase.firestore()
const auth = firebase.auth()

const voters = db.collection("voters")
const admins = db.collection("admins")
const seniors = db.collection("seniors")
const market = db.collection("market")


export {
    db,
    auth,
    voters,
    admins,
    seniors,
    market
}