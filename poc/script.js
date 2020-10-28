var token;

$(document).ready(function () {
    start();
});


function start() {
    $("#sdmsH1Frame").hide();
    $("#sdmsH23Frame").hide();
    $("#loginH1").click(function () {
        $("#sdmsH1Frame").show();
    });
    $("#loginH23").click(function () {
        login("kabeng027", "perbani");
    });
}

function login(user, pass) {
    $.ajax({
        type: "POST",
        url: "https://sdmstrial-h23.mpm-motor.com:8323/api/authenticate",
        data: { username: user, password: pass },
        success: loginSuccess,
    });
}

function loginSuccess(data) {
    token = data.id_token;
    $.ajax({
        type: "GET",
        url: "https://sdmstrial-h23.mpm-motor.com:8323/api/account",
        headers: { Authorization: "Bearer " + token },
        success: init,
    });

}

function init(data) {
    $("#sdmsH23Frame").get(0).contentWindow.postMessage({
        idinternal: '"' + data.idInternal + '"',
        authenticationtoken: '"' + token + '"',
        username: '"' + data.login + '"'
    }, "*");

    // Tambahkan script ini di index.html target dari iframe
    /*
    <script>
        window.onmessage = function(e){
            if(e.data.idinternal) {
                window.sessionStorage.setItem("jhi-idinternal", e.data.idinternal);
            }
            if(e.data.authenticationtoken) {
                window.sessionStorage.setItem("jhi-authenticationtoken", e.data.authenticationtoken);
            }
            if(e.data.username) {
                window.sessionStorage.setItem("jhi-username", e.data.username);
            }
        };
    </script>
    */

    $("#loginContainer").hide();
    $("#sdmsH23Frame").get(0).onload = function () {
        $("#sdmsH23Frame").show();
    }
    $("#sdmsH23Frame").get(0).src = "https://sdmstrial-h23.mpm-motor.com/";
}