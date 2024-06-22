const onloadFunc = () => {
    const hrefurl = window.location.href;
    const lastIndexOf__id = hrefurl.lastIndexOf('/');
    const __id = hrefurl.substring(lastIndexOf__id+1,hrefurl.length);

    fetch(`/posts/${__id}/getdatas`)
    .then(res => res.json())
    .then(res => {        
        // 글 내용 읽기 처리
        document.querySelector('[name="post-title"').innerText = res.title;
        document.querySelector('[name="post-author"').innerText = res.author.name;
        document.querySelector('[name="post-createdAt"').innerText = res.updateAt;
        document.querySelector('[name="post-content"').innerText = res.content;

        // 댓글 내용 읽기 처리 (html template 활용하기)
        const template = document.querySelector('#comment-template');
        for(var i = res.comments.length - 1; i >= 0; i--){
            var node = document.importNode(template.content, true);
            node.querySelector('.content').textContent = res.comments[i].content;
            node.querySelector('.author').textContent = res.comments[i].author.name;
            node.querySelector('.createAt').textContent = res.comments[i].createAt;
            node.querySelector('.createAt').textContent = res.comments[i].createAt;
            node.querySelector('.comment_id').textContent = res.comments[i].__id;
            document.querySelector('#comments').appendChild(node);
        }
    })
    .catch(err => {
        alert('글 + 댓글 읽는 과정 중 오류 발생 사유: 알 수 없음');
    });
}

onloadFunc();

const postDelete = () => {
    const hrefurl = window.location.href;
    const lastIndexOf__id = hrefurl.lastIndexOf('/');
    const __id = hrefurl.substring(lastIndexOf__id+1,hrefurl.length);

    fetch(`/posts/delete/${__id}`, {
        method: "delete"
    })
    .then(res => res.json())
    .then(res => {
        console.log("test");
        console.log(res.status);
        if(res.deletes === "ok")
        {
            alert('success deleted');
            window.location.href = `/posts?page=1&myposts=false`;
        }
        else if(res.deletes === "notok") {
            console.log(res);
            alert('삭제가 불가합니다. 사유 : 작성자 아님');
        }
        else if(res.deletes === "notlogin"){
            alert('삭제가 불가합니다. 사유 : 로그인하지 않음');
        }
    })
    .catch( (e) => {
        alert(e);
    });
}

const writeComment = () => {
    const hrefurl = window.location.href;
    const lastIndexOf__id = hrefurl.lastIndexOf('/');
    const __id = hrefurl.substring(lastIndexOf__id+1,hrefurl.length);

    const content = document.querySelector('#content').value;
    fetch(`/posts/${__id}/comments`,{
        method: "post",
        // post 로 req.body 보낼 시 header 작성하기
        headers: {'Content-Type': 'application/json'},
        // body: JSON.stringify({asdf:"sdf"}) // 옵션은 JSON 변환 필수 !
        body: JSON.stringify({content})
    })
    .then(res => res.json())
    .then(res => {
        if(res.result === "success"){
            window.location.href = `/posts/${__id}`;
        } else if(res.result === "fail"){
            alert('로그인이 필요한 서비스입니다.');
            window.location.href = `/posts/${__id}`;
        } else if(res.result === "noncontent") {
            alert('댓글을 입력하세요.');
        }
        else {
            alert('Session user can\'t find in UserDB');
            window.location.href = `/posts/${__id}`;
        }
    })
    .catch(err => {
        console.log(err);
        alert('댓글 등록 실패 사유: 알 수 없음');
    });
}

const deleteComment = () => {
    const hrefurl = window.location.href;
    const lastIndexOf__id = hrefurl.lastIndexOf('/');
    const __id = hrefurl.substring(lastIndexOf__id+1,hrefurl.length);
    const comment_id = document.querySelector('.comment_id').innerText;
    
    fetch(`/posts/${__id}/comments?comment_id=${comment_id}`,{
        method: "delete",
        // post 로 req.body 보낼 시 header 작성하기
        headers: {'Content-Type': 'application/json'},
        // body: JSON.stringify({asdf:"sdf"}) // 옵션은 JSON 변환 필수 !
    })
    .then(res => res.json())
    .then(res => {
        if(res.result === "success"){
            window.location.href = `/posts/${__id}`;
        } else if(res.result === "fail"){
            alert('로그인이 필요한 서비스입니다.');
            window.location.href = `/posts/${__id}`;
        } 
        else {
            alert('Session user can\'t find in UserDB');
            window.location.href = `/posts/${__id}`;
        }
    })
    .catch(err => {
        console.log(err);
        alert('댓글 등록 실패 사유: 알 수 없음');
    });

}