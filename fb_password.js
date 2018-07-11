// Initialize Firebase
var config = {
  apiKey: "AIzaSyAbRIahEJ62ow1ZXbEIJM0EPMOxqYK3VTE",
  authDomain: "the-band-music.firebaseapp.com",
  databaseURL: "https://the-band-music.firebaseio.com",
  projectId: "the-band-music",
  storageBucket: "the-band-music.appspot.com",
  messagingSenderId: "241471440965"
};
const theBandApp = firebase.initializeApp(config);
// db
const store = theBandApp.firestore();
const dbSettings = {timestampsInSnapshots: true};
store.settings(dbSettings);

// storage
const storage = theBandApp.storage();
const storageRef = storage.ref();

// firebase export
export {store, storage, storageRef};

export function updateTour(docElementId){
  store.collection("tours").get().then((querySnapshot) => {
    let tourList = document.getElementById(docElementId);
    console.log(tourList);
    let li = "";
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
      let data = doc.data();
      let list = "";
      list += `<div class="state">${data.name}, `;
      let date = new Date(data.date.seconds*1000);
      date = date.toLocaleDateString('en-US',{year:'numeric', month: '2-digit', day: '2-digit'})
      .replace(/(\d+)\/(\d+)\/(\d+)/,'$2/$1/$3');
      console.log('Date: ',date);
      list += `${date}</div>`;
      list += `<div class="place">${data.city}, `;
      list += `${data.country}</div>`;
      li += `<li>${list}</li>`;

    });
    tourList.innerHTML = li;
  });
}
