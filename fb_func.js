window.onload = ()=>{

  db.collection("tours").get().then((querySnapshot) => {
    let tourList = document.getElementById('tabloList');
    console.log(tourList);
    let list = "";
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
      let data = doc.data();
      list += `<span>${data.name}</span><br>`;
      let date = new Date(data.date.seconds*1000);
      date = date.toLocaleDateString('en-US',{year:'numeric', month: '2-digit', day: '2-digit'})
      .replace(/(\d+)\/(\d+)\/(\d+)/,'$2/$1/$3');
      console.log('Date: ',date);
      list += `<span>${date}</span><br>`;
      list += `<span>${data.city}</span><br>`;
      list += `<span>${data.country}</span><br>`;
      list = `<li>${list}</li>`;
    });
    tourList.innerHTML = list;
  });
};
