import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

// utils
const db = firebase.firestore()
const auth = firebase.auth()

const voters = db.collection("voters")
const admins = db.collection("admins")
const seniors = db.collection("seniors")
const market = db.collection("market")
const ads = db.collection("advertising")
const transactions = db.collection("transactions")

async function listAll(collection){
    var data = await collection.get()
    var list = []
    for(let doc of data.docs){
        list.push(doc.data())
    }
    return list
}

async function getUserDoc(data){
    var userDoc = undefined
    if(data.collection == 'seniors'){
        console.log(data.user.email)
        const collection = await seniors.get()
        for(let doc of collection.docs){
          for(let email of doc.data().emails){
            if(email == data.user.email){
                userDoc = doc
                break
            }
          }
        }
      }
      else if(data.collection == 'voters'){
        userDoc = await voters.doc(data.user.uid).get()
      }
      return userDoc
}


function getUserMeta(){
    var collection = localStorage.getItem('collection')
    return {user:auth.currentUser, collection: collection}
}

async function getDocument(collection, prop, value){
  var data = await collection.where(prop, '==', value).get()
  return data.docs[0]
}

export {
    db,
    auth,
    voters,
    admins,
    seniors,
    market,
    ads,
    transactions,
    listAll,
    getUserDoc,
    getUserMeta,
    getDocument
}