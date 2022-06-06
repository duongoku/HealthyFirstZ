$(document).ready(function () {
    var table = $("#adminTable").DataTable({
        searching: true,
        ajax: {
            url: `/users`,
            type: "GET",
            beforeSend: function (request) {
                request.setRequestHeader(
                    "Authorization",
                    `Bearer ${localStorage.getItem("accessToken")}`
                );
            },
        },
    });
});

document.getElementById("logoutButton").onclick = logout;
