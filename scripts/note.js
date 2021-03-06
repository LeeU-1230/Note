
let message = document.querySelector('#message');
let btn = document.querySelector('#btn');
let list = document.querySelector('#list');
let content = document.querySelectorAll('content');
let all = document.getElementById('all');
let notyet = document.getElementById('notyet');
let finish = document.getElementById('finish');
let back = document.getElementById('back');

btn.addEventListener('click', Saving);

function Saving(e) {
    e.preventDefault();
    let value = message.value.trim();     // trim()刪除空格
    let do_check = value.search('>');
    if (value == '' || do_check > -1) {
        return;
    }

    let vueId = Math.floor(Date.now());
    let now = new Date();                       // 加上新增訊息的日期
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let date = now.getDate();
    let hour = now.getHours();
    let minute = now.getMinutes();
    let second = now.getSeconds();

    let newMessage = {                           // 要記錄的資訊
        timeCode: now,
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

function record(msg) {                                    // 保存資料到server

    db.collection(login_id).add({
        timeCode: msg.timeCode,
        Id: msg.Id,
        arrt: msg.arrt,
        decoration: msg.decoration,
        name: msg.name,
        time: msg.time

    })
}

function msg_update(value) {
    db.collection(login_id).update({                                         // 更新server上的資料
        name: value
    })
}


function get_ref() {                                     // 取得server上的資料
    db.collection(login_id).onSnapshot(function (querySnapshot) {

        let data = [];
        querySnapshot.forEach(function (doc) {
            data.push(doc.data());
        });

        let newdata = data.sort(function (a, b) {
            return b.timeCode - a.timeCode;
        })

        Printing(newdata)
    });
}

function Printing(data) {                                               // 輸出呈現
    let str = '';
    for (let i = 0; i < data.length; i++) {

        str += `<li id=${data[i].Id} class="list-group-item list-group-item-success row">
        <div class="row">
        <input class='col-2 checkbox' type='checkbox' ${data[i].arrt}>
        <span class='time col-10'>${data[i].time}發布</span>
        </div>
        <div class="row" style='text-decoration:${data[i].decoration};'>
        <span class="col-2"></span>
        <span class="col-8 content">${data[i].name}</span>
        <a href="#" class="close" data-num=${i}>&times;</a>
        </div>
        </li>`
    }
    list.innerHTML = str;
}



all.addEventListener('click', function () {          // 全部項目
    get_ref();
    all.classList.add('active');
    notyet.classList.remove('active');
    finish.classList.remove('active');
})

notyet.addEventListener('click', function (e) {                         // 未完成資料項目
    db.collection(login_id).where("arrt", "==", "checked").onSnapshot(function (querySnapshot) {

        let data = [];
        querySnapshot.forEach(function (doc) {
            data.push(doc.data());
        });

        let newdata = data.sort(function (a, b) {
            return b.timeCode - a.timeCode;
        })
        Printing(newdata)
    });

    notyet.classList.add('active');
    all.classList.remove('active');
    finish.classList.remove('active');
});

finish.addEventListener('click', function (e) {                          // 已完成資料項目
    db.collection(login_id).where("arrt", "==", "").onSnapshot(function (querySnapshot) {

        let data = [];
        querySnapshot.forEach(function (doc) {
            data.push(doc.data());
        });

        let newdata = data.sort(function (a, b) {
            return b.timeCode - a.timeCode;
        })

        Printing(newdata)
    });

    finish.classList.add('active');
    notyet.classList.remove('active');
    all.classList.remove('active');
})


list.addEventListener('dblclick', contentChange);          // 雙擊修改資料內容
function contentChange(e) {
    e.preventDefault();

    if (e.target.className === 'col-8 content') {

        let id = e.target.parentNode.id;
        let result = prompt('修改內容', e.target.textContent).trim();

        if (result == '') {
            return e.target.textContent;
        }

        db.collection(login_id).where("name", "==", e.target.textContent).get()
            .then(function (querySnapshot) {

                let reid;
                querySnapshot.forEach(function (doc) {
                    // doc.data() is never undefined for query doc snapshots
                    // console.log(doc.id, " => ", doc.data());
                    reid = doc.id;
                });

                return reid

            }).then((value) => {

                db.collection(login_id).doc(value).update({
                    name: `${result}`
                })

            })

    }
    get_ref();
}

list.addEventListener('click', Delete);
function Delete(e) {
    e.preventDefault();
    if (e.target.textContent == '×') {      // 刪除資料項

        let id = Number(e.target.parentNode.parentNode.id);     // 取得畫面的資料項id

        db.collection(login_id).where("Id", "==", id).get()
            .then(function (querySnapshot) {

                let reid;
                querySnapshot.forEach(function (doc) {
                    reid = doc.id;

                });

                return reid
            }).then((value) => {

                db.collection(login_id).doc(value).delete().then(function () {
                    console.log("Document successfully deleted!");

                })
            })
    }

    if (e.target.type === 'checkbox') {                                  // 完成的核取方塊
        let index = Number(e.target.parentNode.parentNode.id);

        db.collection(login_id).where("Id", "==", index).get()
            .then(function (querySnapshot) {

                let re_index = [];

                querySnapshot.forEach(function (doc) {
                    re_index.push(doc.id, doc.data().decoration, doc.data().arrt);
                });

                return re_index

            }).then((re_index) => {

                if (re_index[1] == 'none') {

                    db.collection(login_id).doc(re_index[0]).update({
                        decoration: 'line-through',
                        arrt: 'checked'
                    })

                } else {
                    db.collection(login_id).doc(re_index[0]).update({
                        decoration: 'none',
                        arrt: ''
                    })
                }
            })
    };
}

back.addEventListener('click', function (e) {     // 返回登入頁面
    location.reload()
})

message.addEventListener('keyup', function (e) {                    // enter輸入
    e.preventDefault();
    if (e.keyCode == 13) {
        btn.click();
    }
});