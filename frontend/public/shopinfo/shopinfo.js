const shopId = document.getElementById("shopId").value;
const userId = localStorage.getItem("currentUser");

var bigCur;

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
            bigCur = cur;

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

            body.innerHTML += tmp_1 + "Địa bàn" + tmp_2 + cur.ward + tmp_3;

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
            phone: bigCur.phone,
            type: bigCur.type,
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
            phone: bigCur.phone,
            type: bigCur.type,
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
            phone: bigCur.phone,
            type: bigCur.type,
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

async function addNewExamination() {
    const dateFrom = document.getElementById("dateFrom").value;
    const timeFrom = document.getElementById("timeFrom").value;
    const combinedTimeFrom = `${dateFrom}T${timeFrom}:00.000Z`;

    const dateTo = document.getElementById("dateTo").value;
    const timeTo = document.getElementById("timeTo").value;
    const combinedTimeTo = `${dateTo}T${timeTo}:00.000Z`;

    const status = document.getElementById("select").value;

    try {
        let newexam = await fetch(`/examinations/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify({
                from: combinedTimeFrom,
                to: combinedTimeTo,
                shop_id: shopId,
                status: status,
            }),
        });
        newexam = await newexam.json();

        let newtest = await fetch(`/tests/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify({
                taken: combinedTimeFrom,
                status: "Đang xử lý",
                result: "Không đạt",
                processing_unit: "Chưa xác định",
                result_date: combinedTimeTo,
            }),
        });
        newtest = await newtest.json();

        await fetch(`/examinations/${newexam.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify({
                test_id: newtest.id,
            }),
        });

        alert("Đã lên kế hoạch thanh tra");
    } catch (err) {
        alert("Có lỗi xảy ra khi lên kế hoạch thanh tra");
        console.log(err);
    }
}

getShopInfo();

document.getElementById("logoutButton").onclick = logout;

document.getElementById("addPlanBtn").onclick = addNewExamination;

document
    .getElementById("updateShopModal")
    .addEventListener("shown.bs.modal", function () {
        document.getElementById("shopName").value = bigCur.name;
        document.getElementById("shopAddress").value = bigCur.address;
        document.getElementById("shopWard").value = bigCur.ward;
        document.getElementById("shopPhone").value = bigCur.phone;
        document.getElementById("shopType").value = bigCur.type;
    });

document.getElementById("updateShop").onclick = function () {
    var shopName = document.getElementById("shopName").value;
    var address = document.getElementById("shopAddress").value;
    var ward = document.getElementById("shopWard").value;
    var phone = document.getElementById("shopPhone").value;
    var type = document.getElementById("shopType").value;

    if (
        shopName.length === 0 ||
        address.length === 0 ||
        ward.length === 0 ||
        phone.length === 0 ||
        type.length === 0
    ) {
        alert("Vui lòng nhập đầy đủ thông tin");
        return;
    }

    // Check if phone number is not valid
    if (!phone.match(/^[0-9]{10,11}$/)) {
        alert("Số điện thoại không hợp lệ");
        return;
    }

    fetch(`/shops/${shopId}/users/${userId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
            name: shopName,
            address: address,
            ward: ward,
            phone: phone,
            type: type,
        }),
    })
        .then(function (response) {
            if (response.status === 204) {
                alert("Đã cập nhật thông tin cửa hàng");
                getShopInfo();
            } else {
                alert("Có lỗi xảy ra khi cập nhật thông tin cửa hàng");
            }
        })
        .catch(function (err) {
            alert("Có lỗi xảy ra khi cập nhật thông tin cửa hàng");
            console.log(err);
        });
};

document.getElementById("deleteShop").onclick = function () {
    fetch(`/shops/${shopId}/users/${userId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    })
        .then(function (response) {
            if (response.status === 204) {
                alert("Đã xóa cửa hàng");
                window.location.href = "/foodshop";
            } else {
                alert("Có lỗi xảy ra khi xóa cửa hàng");
            }
        })
        .catch(function (err) {
            alert("Có lỗi xảy ra khi xóa cửa hàng");
            console.log(err);
        });
};
