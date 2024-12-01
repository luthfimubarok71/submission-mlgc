const { Firestore } = require('@google-cloud/firestore');
 
const db = new Firestore();
const predictCollection = db.collection('predictions');

async function storeData(id, data) {
 
  return predictCollection.doc(id).set(data);
  
}
 
module.exports = { storeData, predictCollection };
