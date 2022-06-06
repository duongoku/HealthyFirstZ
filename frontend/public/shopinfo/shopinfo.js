const shopId = document.getElementById("shopId").value;
const userId = localStorage.getItem("currentUser");

function getShopInfo() {
    fetch(`/shops/${shopId}/users/${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    })
        .then((response) => {
            return response.json();
        })
        .then((cur) => {
            let header = document.createElement("div");
            header.classList.add("card-header");
            header.innerHTML = "<b>" + cur.name + "</b>";

            let body = document.createElement("div");
            body.classList.add("card-body");
            let tmp_1 =
                "<div class='row' style='padding: 5px;'><div class='col-sm-4'>";
            let tmp_2 = ": </div> <div class='col-sm-6'>";
            let tmp_3 = "</div></div>";

            body.innerHTML = tmp_1 + "Địa chỉ" + tmp_2 + cur.address + tmp_3;

            body.innerHTML +=
                tmp_1 + "Thanh tra phụ trách" + tmp_2 + cur.ward + tmp_3;

            body.innerHTML +=
                tmp_1 + "Số điện thoại" + tmp_2 + cur.phone + tmp_3;

            body.innerHTML +=
                tmp_1 + "Loại hình kinh doanh" + tmp_2 + cur.type + tmp_3;

            let cert;

            if (cur.isValid === true) {
                cert = "Còn hiệu lực đến " + formatDate(cur.validBefore, 1);
            } else if (cur.isValid === false) {
                cert = "Đã bị thu hồi";
            } else if (
                cur.isValid === undefined ||
                cur.validBefore === undefined
            ) {
                cert = "Chưa có giấy chứng nhận";
            }

            if (
                cur.validBefore !== undefined &&
                new Date(cur.validBefore) < new Date()
            ) {
                cert = "Đã hết hiệu lực";
            }

            body.innerHTML += tmp_1 + "Giấy chứng nhận" + tmp_2 + cert + tmp_3;

            document.querySelector(".card").innerHTML = "";
            document.querySelector(".card").appendChild(header);
            document.querySelector(".card").appendChild(body);
        });
}

document.getElementById("issueCert").onclick = function () {
    const dateEl = document.getElementById("date1").value;
    const timeEl = document.getElementById("time1").value;
    const combinedTime = `${dateEl}T${timeEl}:00.000Z`;

    fetch(`/shops/${shopId}/users/${userId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
            isValid: true,
            validBefore: combinedTime,
        }),
    })
        .then((response) => {
            if (response.status === 204) {
                alert("Đã cấp giấy chứng nhận");
                getShopInfo();
            }
        })
        .catch((err) => {
            alert("Có lỗi xảy ra khi cấp giấy chứng nhận");
            console.log(err);
        });
};

document.getElementById("extendCert").onclick = function () {
    var dateEl = document.getElementById("date2").value;
    var timeEl = document.getElementById("time2").value;
    const combinedTime = `${dateEl}T${timeEl}:00.000Z`;

    fetch(`/shops/${shopId}/users/${userId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
            isValid: true,
            validBefore: combinedTime,
        }),
    })
        .then((response) => {
            if (response.status === 204) {
                alert("Đã gia hạn chứng nhận");
                getShopInfo();
            }
        })
        .catch((err) => {
            alert("Có lỗi xảy ra khi gia hạn chứng nhận");
            console.log(err);
        });
};

document.getElementById("cancelCert").onclick = function () {
    fetch(`/shops/${shopId}/users/${userId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
            isValid: false,
        }),
    })
        .then((response) => {
            if (response.status === 204) {
                alert("Đã hủy chứng nhận");
                getShopInfo();
            }
        })
        .catch((err) => {
            alert("Có lỗi xảy ra khi hủy chứng nhận");
            console.log(err);
        });
};

getShopInfo();

document.getElementById("logoutButton").onclick = logout;

document.getElementById("addPlanBtn").onclick = function () {
    alert("Đã lên kế hoạch thanh tra");

    let dateFrom = document.getElementById("dateFrom").value;
    let timeFrom = document.getElementById("timeFrom").value;

    let dateTo = document.getElementById("dateTo").value;
    let timeTo = document.getElementById("timeTo").value;

    // do duongoku things
}
