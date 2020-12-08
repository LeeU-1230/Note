let user_in = document.getElementById('user_in');
        let user_create = document.getElementById('user_create');
        let Login = document.getElementById('Login');
        let Signup = document.getElementById('Signup');
        let cardbody = document.querySelector('.cardbody');

        user_in.addEventListener('click', function () {
            user_in.classList.add('active');
            user_create.classList.remove('active');
            Login.style.display = 'block';
            Signup.style.display = 'none';
            cardbody.classList.remove('bg-info');
            cardbody.classList.add('bg-secondary');
        })

        user_create.addEventListener('click', function () {
            user_create.classList.add('active');
            user_in.classList.remove('active');
            Signup.style.display = 'block';
            Login.style.display = 'none';
            cardbody.classList.add('bg-info');
            cardbody.classList.remove('bg-secondary');
        })
        
        window.addEventListener('load',function(){
            user_in.click();
        })