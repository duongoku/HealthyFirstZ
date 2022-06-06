$(document).ready(function () {
    var table = $("#adminTable").DataTable({
        searching: true,
        ajax: {
            // do duongoku things
        },
    });
});

document.getElementById("logoutButton").onclick = logout;
