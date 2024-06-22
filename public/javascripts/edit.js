const onloadFunc = () => {
    // 이전 페이지 주소 가져오기
    const hrefurl = document.referrer;
    const lastIndexOf__id = hrefurl.lastIndexOf('/');
    const __id = hrefurl.substring(lastIndexOf__id+1,hrefurl.length);
    //console.log(__id)

    if(!__id.includes("posts?page=")) {
        fetch(`/posts/edit/${__id}`)
        .then(res => res.json())
        .then(res => {
            if(res.title){
                document.querySelector('[name="title"]').value = res.title;
                document.querySelector('[name="content"]').value = res.content;
                document.querySelector('[name="submit"]').value = "수정완료";
                document.querySelector('[name="edit-form"]').action = `/posts/edit/${__id}`;
            }
            else if(res.edit){
                alert('수정이 불가합니다. 사유 : 작성자 아님');
                window.history.back();
            }
            // 로그인 체크는 미들웨어로 처리함
        })
        .catch(e => {
            alert('수정이 불가합니다. 사유 : 알 수 없음');
            window.history.back();
        });
    }
    else{
            document.querySelector('[name="title"]').value = "";
            document.querySelector('[name="content"]').value = "";
            document.querySelector('[name="submit"]').value = "등록하기";
            document.querySelector('[name="edit-form"]').action = `/posts/edit`;
    }
};

onloadFunc();

const check = () => {
    if(document.querySelector('[name="title"]').value.length < 1){
        alert("제목을 입력하세요.");
        return false;
    }
    if(document.querySelector('[name="content"]').value.length < 1){
        alert("내용을 입력하세요.");
        return false;
    }
    return true;
}