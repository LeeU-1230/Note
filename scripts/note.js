firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();
let ref = db.collection('lists');

let message = document.querySelector('#message');
let btn = document.querySelector('#btn');
let list = document.querySelector('#list');
let content = document.querySelectorAll('content');
let all = document.getElementById('all');
let notyet = document.getElementById('notyet');
let finish = document.getElementById('finish');

btn.addEventListener('click', Saving);

function Saving(e) {
    e.preventDefault();
    let value = message.value.trim();     // trim()刪除空格
    let do_check = value.search('>');
    if (value == '' || do_check > -1) {
        return;
    }
    let vueId = Math.floor(Date.now());
    let now = new Date();                                    // 加上新增訊息的日期
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let date = now.getDate();
    let hour = now.getHours();
    let minute = now.getMinutes();
    let second = now.getSeconds();

    let newMessage = {
        Id: vueId,
        arrt: '',
        ckecked: 0,
        decoration: 'none',
        name: `${value}`,
        time: `${year}/${month}/${date}，${hour}:${minute} `
    };

    record(newMessage);
    get_ref();
    message.value = '';
}

function record(msg) {                                                 // 保存資料
    ref.add({
        Id: msg.Id,
        arrt: msg.arrt,
        decoration: msg.decoration,
        name: msg.name,
        time: msg.time
    }).then(() => {
        console.log('set data successful');
    });
}

function msg_update(value) {
    ref.update({                                         // update方法更新
        name: value
    }).then(() => {
        console.log('update data successful');
    });
}


function get_ref() {
    ref.onSnapshot(function (querySnapshot) {
        let data = [];
        querySnapshot.forEach(function (doc) {
            data.push(doc.data());
        });
        console.log(data);
        Printing(data)
    });
}

function Printing(data) {                                               // 輸出呈現
    let str = '';
    for (let i = 0; i < data.length; i++) {
        str += `<li id=${data[i].Id} class="list-group-item list-group-item-success row">
<span class='col'><input type='checkbox' ${data[i].arrt}>&emsp;&emsp;</span>
<span class='content col' style='text-decoration:${data[i].decoration};'>${data[i].name}</span>
<span class='time col'>&nbsp; &nbsp; ${data[i].time}發布</span>
<a href="#" class="close" data-num=${i}>&times;</a></li>`
    }
    list.innerHTML = str;
}

window.addEventListener('load', function () {
    get_ref();
})
all.addEventListener('click', function () {
    get_ref();
})

notyet.addEventListener('click', function (e) {
    ref.where("arrt", "==", "checked").onSnapshot(function (querySnapshot) {
        let data = [];
        querySnapshot.forEach(function (doc) {
            data.push(doc.data());
        });
        console.log(data);
        Printing(data)
    });
});

finish.addEventListener('click', function (e) {
    ref.where("arrt", "==", "").onSnapshot(function (querySnapshot) {
        let data = [];
        querySnapshot.forEach(function (doc) {
            data.push(doc.data());
        });
        console.log(data);
        Printing(data)
    });
})


list.addEventListener('dblclick', contentChange);
function contentChange(e) {                                 // 修改內容
    console.log(e.target.textContent);
    console.log(e.target.className);

    if (e.target.className === 'content col') {
        let id = e.target.parentNode.id;
        let result = prompt('修改內容', e.target.textContent).trim();
        console.log(result);

        if (result == '') {
            return e.target.textContent;
        }

        ref.where("name", "==", e.target.textContent).get()
            .then(function (querySnapshot) {
                let reid;
                querySnapshot.forEach(function (doc) {
                    // doc.data() is never undefined for query doc snapshots
                    // console.log(doc.id, " => ", doc.data());
                    reid = doc.id;
                });

                return reid
            }).then((value) => {
                console.log(value);

                ref.doc(value).update({
                    name: `${result}`
                }).then(() => {
                    console.log('update data successful');
                });
            })

    }
    get_ref();
}

list.addEventListener('click', Delete);
function Delete(e) {
    if (e.target.textContent == '×') {                               // 刪除資料項
        let id = Number(e.target.parentNode.id);
        console.log(id, typeof (id));
        ref.where("Id", "==", id).get()
            .then(function (querySnapshot) {
                let reid;
                querySnapshot.forEach(function (doc) {
                    // doc.data() is never undefined for query doc snapshots
                    // console.log(doc.id, " => ", doc.data());
                    reid = doc.id;
                });

                return reid
            }).then((value) => {
                ref.doc(value).delete().then(function () {
                    console.log("Document successfully deleted!");
                })
            })
    }

    if (e.target.type === 'checkbox') {                            // 完成的核取方塊
        let index = Number(e.target.parentNode.parentNode.id);
        console.log(e.target.parentNode.parentNode.id);

        ref.where("Id", "==", index).get()
            .then(function (querySnapshot) {
                let re_index = [];
                // let re_decoration;
                querySnapshot.forEach(function (doc) {
                    // doc.data() is never undefined for query doc snapshots
                    // console.log(doc.id, " => ", doc.data());
                    re_index.push(doc.id, doc.data().decoration, doc.data().arrt);
                });
                console.log(re_index);
                return re_index
            }).then((re_index) => {
                console.log(re_index[1]);
                if (re_index[1] == 'none') {

                    ref.doc(re_index[0]).update({
                        decoration: 'line-through',
                        arrt: 'checked'
                    }).then(() => {
                        console.log('update data successful');
                    });


                } else {
                    ref.doc(re_index[0]).update({
                        decoration: 'none',
                        arrt: ''
                    }).then(() => {
                        console.log('update data successful');
                    });
                }
            })
    };
}

message.addEventListener('keyup', function (e) {                    // enter輸入
    e.preventDefault();
    if (e.keyCode == 13) {
        btn.click();
    }
});