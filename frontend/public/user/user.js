fetch('../data/users.json').then(response => { // do duongoku things
    return response.json();
}).then(tests => {
    let cur = tests.data[0];

    let header = document.createElement("div");
    header.classList.add("card-header");
    header.innerHTML = "<b>" + cur.firstName + " " + cur.lastName + "</b>";

    let body = document.createElement("div");
    body.classList.add("card-body");
    let tmp_1 = "<div class='row' style='padding: 5px;'><div class='col-sm-4'>";
    let tmp_2 = ": </div> <div class='col-sm-6'>";
    let tmp_3 = "</div></div>";

    body.innerHTML += tmp_1 + "Email" + tmp_2 + cur.email + tmp_3;

    body.innerHTML += tmp_1 + "Địa bàn hoạt động" + tmp_2 + cur.ward + tmp_3;

    body.innerHTML += tmp_1 + "Chức danh" + tmp_2 + cur.permissionFlags + tmp_3;

    document.querySelector(".card").appendChild(header);
    document.querySelector(".card").appendChild(body);
});
