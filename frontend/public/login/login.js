function login() {
    var email = $("#email").val();
    var password = $("#password").val();
    var url = "/auth";
    var data = {
        email: email,
        password: password,
    };
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);
            localStorage.setItem("currentUser", data.userId);
            window.location.href = "/user";
        })
        .catch(function (error) {
            console.log(error);
        });
}

document.getElementById("loginButton").onclick = login;
