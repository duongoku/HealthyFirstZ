
function login() {
    //login action
    // do duongoku things

    console.log("login");
    var username = $('#username').val();
    var password = $('#password').val();
    var url = "http://localhost:8000/login";
    var data = {
        username: username,
        password: password
    };
    $.ajax({
        url: url,
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            console.log(data);
            if (data.status == "success") {
                window.location.href = "../index/index.html";
            } else {
                $('#error').text(data.message);
            }
        }
    });
}
