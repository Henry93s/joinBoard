module.exports = (code) => {
    var text = "";
    if(code === "password"){
        var possible = "abcdefghijklmnopqrstuvwxyz0123456789!@$%^&*()_+~:;<>";
        for(var i = 0; i < 12; i++ ) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
    }
    else if(code === "verifycode"){
        var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
        for(var i = 0; i < 6; i++ ) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
    }

    return text;
}