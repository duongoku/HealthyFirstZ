fetch('../data/shops.json').then(response => { // do duongoku things
    return response.json();
}).then(shops => {
    let cur = shops.data[0];

    let header = document.createElement("div");
    header.classList.add("card-header");
    header.innerHTML = "<b>" + cur.name + "</b>";

    let body = document.createElement("div");
    body.classList.add("card-body");
    let tmp_1 = "<div class='row' style='padding: 5px;'><div class='col-sm-4'>";
    let tmp_2 = ": </div> <div class='col-sm-6'>";
    let tmp_3 = "</div></div>";

    body.innerHTML = tmp_1 + "Địa chỉ" + tmp_2 + cur.address + tmp_3;

    body.innerHTML += tmp_1 + "Thanh tra phụ trách" + tmp_2 + cur.ward + tmp_3;

    body.innerHTML += tmp_1 + "Số điện thoại" + tmp_2 + cur.phone + tmp_3;

    body.innerHTML += tmp_1 + "Loại hình kinh doanh" + tmp_2 + cur.type + tmp_3;

    let cert;

    if (cur.isValid === true) {
        cert = "Còn hiệu lực đến " + formatDate(cur.validBefore, 1);
    } else if (cur.isValid === false) {
        cert = "Đã bị thu hồi";
    } else if (cur.isValid === null || cur.validBefore === null) {
        cert = "Chưa có giấy chứng nhận";
    }

    if (cur.validBefore !== null && new Date(cur.validBefore) < new Date()) {
        cert = "Đã hết hiệu lực";
    }

    body.innerHTML += tmp_1 + "Giấy chứng nhận: " + tmp_2 + cert + tmp_3;

    document.querySelector(".card").appendChild(header);
    document.querySelector(".card").appendChild(body);
});


function issueCert() {
    var dateEl = document.getElementById('date1');
    var timeEl = document.getElementById('time1');

    // do duongoku things

    console.log("Đã cấp giấy chứng nhận");
    alert("Đã cấp giấy chứng nhận");
}

function extendCert() {
    var dateEl = document.getElementById('date2');
    var timeEl = document.getElementById('time2');

    // do duongoku things

    console.log("Đã gia hạn giấy chứng nhận");
    alert("Đã gia hạn giấy chứng nhận");
}

function cancelCert() {
    // do duongoku things

    console.log("Đã hủy giấy chứng nhận");
    alert("Đã hủy giấy chứng nhận");
}
