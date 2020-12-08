firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();
let ref = db.collection('Users');

let login = document.getElementById('login');
let note = document.getElementById('note')

let login_account = document.getElementById('login_account');
let login_password = document.getElementById('login_password');
let login_btn = document.getElementById('login_btn');
let create_account = document.getElementById('create_account');
let create_password = document.getElementById('create_password');
let create_name = document.getElementById('create_name');
let creat_btn = document.getElementById('creat_btn');
let login_user;         // 登入user的暱稱
let login_id;           // 登入user的id

login_btn.addEventListener('click', function () {
    let user = {
        email: login_account.value,
        pwd: login_password.value
    };

    firebase.auth().signInWithEmailAndPassword(user.email, user.pwd)
        .then((u) => {
            let date = new Date();              
            let now = date.getTime();           // 取得登入的時間

            ref.doc(u.user.uid).update({        // 記錄資訊到 Cloud
                "user.signup": now,
                "user.email": user.email

            }).then(() => {
                // 登入成功後顯示訊息
                alert(`成功登入`);

                ref.doc(u.user.uid).get().then(
                    function (doc) {
                        login_user = doc.data().user.name;  // 取得此id的用戶暱稱
                        login_id = doc.data().user.id;      // 取得此id的uid
                    }
                )


                login.style.display = 'none';     // 隱藏登入畫面
                note.style.display = 'block';     // 顯示備忘欄介面

                db.collection(u.user.uid).onSnapshot(function (querySnapshot) {  // 登入時載入備忘欄資料

                    let data = [];
                    querySnapshot.forEach(function (doc) {
                        data.push(doc.data());
                    });
            
                    let newdata = data.sort(function (a, b) {
                        return b.timeCode - a.timeCode;
                    })
            
                    Printing(newdata)
                });                 
                all.classList.add('active');

            });
        }).catch(err => {
            // 登入失敗時顯示錯誤訊息
            alert(err.message);
        });

    login_account.value = '';
    login_password.value = '';
})

creat_btn.addEventListener('click', function () {

    let user = {
        email: create_account.value,
        pwd: create_password.value,
        name: create_name.value
    };

    firebase.auth().createUserWithEmailAndPassword(user.email, user.pwd)
        .then((u) => {

            // 取得註冊當下的時間
            let date = new Date();
            let now = date.getTime();

            // 記錄相關資訊到 Cloud
            ref.doc(u.user.uid).set({
                msg: [],
                user: {
                    id: u.user.uid,
                    signup: now,
                    email: user.email,
                    name: user.name
                }
            }).then(() => {
                // 儲存成功後顯示訊息
                alert('使用者建立完成');
            });
        }).catch(err => {
            // 註冊失敗時顯示錯誤訊息
            alert(err.message);
        });

    create_account.value = '';
    create_password.value = '';
    create_name.value = '';
})