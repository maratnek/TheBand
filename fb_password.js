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

export function tourList(querySnapshot, docElementId){
    let tourList = document.getElementById(docElementId);
    let li = "";
    let tMillis = new Date();
    let today = new Date(tMillis.getFullYear(), tMillis.getMonth(), tMillis.getDate());
    console.log(today.getTime(), "date now");
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
      let data = doc.data();
      let list = "";
      list += `<div class="state">${data.name}, `;
      let date = new Date(data.date.seconds*1000);
      let time = "";
      let compareTime = date.getTime() - today.getTime();
      if (compareTime < 24*3600*1000 && compareTime >= 0 )
        time = "today";
      else if (compareTime < 0)
        time = "yesterday"
      else
        time = "future";
      date = date.toLocaleDateString('en-US',{year:'numeric', month: '2-digit', day: '2-digit'})
      .replace(/(\d+)\/(\d+)\/(\d+)/,'$2/$1/$3');
      console.log('Date: ',date);
      list += `${date}</div>`;
      list += `<div class="place">${data.city}, `;
      list += `${data.country}</div>`;
      li += `<li class=${time}>${list}</li>`;
    });
    tourList.innerHTML = li;
}

export function ticketList(querySnapshot, docElementId){
    let tourList = document.getElementById(docElementId);
    let li = "";
    let tMillis = new Date();
    let today = new Date(tMillis.getFullYear(), tMillis.getMonth(), tMillis.getDate());
    console.log(today.getTime(), "date now");
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      let date = new Date(data.date.seconds*1000);
      let compareTime = date.getTime() - today.getTime();

      if (compareTime < 0 )
        return;

      let time = "";
      // date = date.toLocaleDateString('en-US',{year:'numeric', month: 'short', day: '2-digit'})
      let month = date.toLocaleDateString('en-US',{ month: 'short' });
      let day = date.toLocaleDateString('en-US',{ day: '2-digit' });
      let year = date.getFullYear();
      console.log(year);
      // .replace(/(\d+)\/(\d+)\/(\d+)/,'$2/$1/$3');
      let list = "";
      list += `<div class="date">`;
      list += `<span>${day}</span>` +
              `<span>${month}</span>` +
              `<span>${year}</span>` +
              `</div>`;
      list += `<h3 class="place">${data.name} // ${data.city}, `;
      list += `${data.country}</h3>`;
      list += `<button>Buy Ticket</button>`;
      li += `<li class="">${list}</li>`;
    });
    tourList.innerHTML = li;
}

export function updateTour(docElementId, listForm){
  store.collection("tours").orderBy("date").get()
  .then((querySnapshot) => {listForm(querySnapshot, docElementId)});
}
