const onloadFunc = () => {
    // console.log(location.href.split('?')[1].split('&'));
    //  ['page=1', 'myposts=true']
    let query = "?page=" + location.href.split('?')[1].split('&')[0].split('=')[1];
    const mypostsquery = '&myposts=' + location.href.split('?')[1].split('&')[1].split('=')[1];
    + '&myposts=' + location.href.split('?')[1].split('&')[1].split('=')[1];
    query = query.concat(mypostsquery);
    // console.log(query);

    fetch(`/posts/getdatas${query}`)
    .then(res => res.json())
    .then(res => {
        // 내 글만 보기 시 로그인하지 않은 사용자 처리
        if(res.mypostsresult == "err"){
            alert("로그인 하지 않은 사용자입니다.");
            window.history.back();
            return;
        }
        else {
            const pageLinks = document.querySelector('#posts-pagination');        
            for(var i = 1; i <= res.totalPage; i++){
                var newLink = pageLinks.appendChild(document.createElement('li'));
                newLink.className = "page-item";
                var newLinkA = newLink.appendChild(document.createElement('a'));
                newLinkA.className = "page-link";

                newLinkA.href = `/posts?page=${i}${mypostsquery}`;
                    if (i === Number(res.page)){
                        newLinkA.style = "padding: 3px; font-weight: bold";
                    } else { newLinkA.style = "padding: 3px"; }
                newLinkA.innerText = i;

            }

            const postsList = document.querySelector('#posts-list');            
            for(var i = 0; i < res.posts.length; i++){
                var newRow = postsList.insertRow();
                var newCell1 = newRow.insertCell(0);
                var newCell1Link = newCell1.appendChild(document.createElement('a'));
                var newCell2 = newRow.insertCell(1);
                var newCell3 = newRow.insertCell(2);
                     
                newCell1Link.href = `/posts/${res.posts[i].__id}`;
                newCell1Link.innerText = res.posts[i].title;
                newCell2.innerText = res.posts[i].author.name;
                newCell3.innerText = res.posts[i].createAt;
            }
            return;
        }
    })
    .catch(e => {
        console.log(e);
        // alert(e);
    });
}
onloadFunc();