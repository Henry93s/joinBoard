const emailVarify = () => {
    const email = document.querySelector('[name="email"]').value;

    fetch('/join/verify',{
        method: "POST",
        headers: {
            "Content-Type": "application/json" },
        body: JSON.stringify({
            code: "email",
            email: email,
            input: email
        })
    })
    .then(res => res.json())
    .then(res => {
        if(res.result === "ok"){
            alert(`인증 코드를 ${email} 에 성공적으로 발송하였습니다.`);
            // verifycode = res.verifycode;
        } else if(res.result === "fail"){
            alert(`인증 코드를 ${email} 에 발송 실패하였습니다. 메일을 다시 확인해 주세요.`);
        } else if(res.result === "user"){
            alert(`${email} 이메일은 이미 가입된 회원입니다. 메일을 다시 확인해 주세요.`);
        } else if(res.result === "nontype"){
            alert(`${email} 이메일 형식에 맞게 작성해주세요.`);
        }
    })
    .catch(e => {
        alert(e);
    });
}

const emailVarifyCheck = () => {
    const email = document.querySelector('[name="email"]').value;
    const email_confirm = document.querySelector('[name="email_confirm"]').value;
    if(!email || !email_confirm){
        alert('이메일과 인증번호를 확인해주세요.');
        return;
    }

    fetch(`/join/verify/${email_confirm}`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json" },
        body: JSON.stringify({
            code: "email",
            input: email,
            secret: email_confirm
        })
    })
    .then(res => res.json())
    .then(res => {
        if(res.result === "ok"){
            alert('이메일 인증이 완료되었습니다.');
        } else if(res.result === "fail"){
            alert('이메일과 인증 코드를 다시 확인해주세요.');
        }
    })
    .catch(e => {
        alert(e);
    });
}