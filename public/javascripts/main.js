const onloadFunc = () => {
    fetch('/getdatas')
    .then(res => res.json())
    .then(res => {
        res.users.forEach( v => {
            var newRow = document.querySelector('#user-list').insertRow();
            var newCell1 = newRow.insertCell(0);
            var newCell2 = newRow.insertCell(1);
            
            newCell1.innerText = v.email;
            newCell2.innerText = v.name;
        });
        const main_button = document.querySelectorAll('#main-button button');
        if(res.session){
            main_button[0].style = "display:inline-block";
            main_button[1].style = "display:inline-block";
            main_button[2].style = "display:none";
            main_button[3].style = "display:none";
        } else {
            main_button[0].style = "display:none";
            main_button[1].style = "display:inline-block";
            main_button[2].style = "display:inline-block";
            main_button[3].style = "display:inline-block";
        }
    })
    .catch(e => {
        console.log(e);
        alert(e);
    });
}
onloadFunc();

const logout = () => {
    fetch('/logout')
    .then(res => res.json())
    .then(res => {
        if(res.result === "ok"){
            alert('정상적으로 로그아웃 되었습니다.'); 
            window.location.replace('/')
        } else {
            alert('로그아웃 실패'); 
            window.location.replace('/')
        }
    })
    .catch(e => {
        alert(e);
    })
};

