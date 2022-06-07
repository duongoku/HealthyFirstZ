// filter by certificate
$.fn.dataTable.ext.search.push(function (settings, data, index) {
    let e = document.getElementById("select");
    let cert = e.options[e.selectedIndex].value;

    let valid = data[2];
    let dueDate = data[3];

    if (cert === "-1") {
        return true;
    }

    if (cert === "0") {
        if (valid === "Còn hiệu lực") {
            return true;
        }
    }

    if (cert === "1") {
        if (valid === "Không có") {
            return true;
        }
    }

    if (cert === "2") {
        if (valid === "Hết hiệu lực") {
            return true;
        }
    }

    if (cert === "3") {
        if (valid === "Đã bị thu hồi") {
            return true;
        }
    }

    return false;
});

// customize datatable
$(document).ready(function () {
    var table = $("#shoptable").DataTable({
        searching: true,
        ajax: {
            url: `/shops/managedby/${localStorage.getItem(
                "currentUser"
            )}/0/999999`,
            type: "GET",
            beforeSend: function (request) {
                request.setRequestHeader(
                    "Authorization",
                    `Bearer ${localStorage.getItem("accessToken")}`
                );
            },
        },
        columns: [
            { data: "name" },
            { data: "type" },
            { data: "isValid" },
            { data: "validBefore" },
        ],
        columnDefs: [
            {
                targets: 0,
                render: function (data, type, row, meta) {
                    // navigate to shop page
                    if (type === "display") {
                        return $("<a>")
                            .attr("href", `/shopinfo/${row._id}`)
                            .text(data)
                            .wrap("<div></div>")
                            .parent()
                            .html();
                    } else {
                        return data;
                    }
                },
            },
            {
                targets: 2,
                render: function (data, type, row, meta) {
                    // change color of certificate
                    if (
                        row["validBefore"] !== undefined &&
                        new Date(row["validBefore"]) < new Date() &&
                        data === false
                    ) {
                        return $("<span>")
                            .attr("class", "text-warning")
                            .text("Hết hiệu lực")
                            .wrap("<div></div>")
                            .parent()
                            .html();
                    }

                    if (data === true) {
                        return $("<span>")
                            .attr("class", "text-success")
                            .text("Còn hiệu lực")
                            .wrap("<div></div>")
                            .parent()
                            .html();
                    } else if (data === false) {
                        return $("<span>")
                            .attr("class", "text-danger")
                            .text("Đã bị thu hồi")
                            .wrap("<div></div>")
                            .parent()
                            .html();
                    } else if (data === undefined) {
                        return $("<span>")
                            .attr("class", "text-danger")
                            .text("Không có")
                            .wrap("<div></div>")
                            .parent()
                            .html();
                    }
                },
            },
            {
                targets: 3,
                render: function (data, type, row, meta) {
                    // reformat date time
                    if (row["isValid"] === undefined || data === undefined) {
                        return " ";
                    }

                    if (type === "display") {
                        return formatDate(data, 2);
                    } else {
                        return data;
                    }
                },
            },
        ],
    });

    $("#select").on("change", function () {
        table.draw();
    });

    document.getElementById("addShop").onclick = function () {
        var shopName = document.getElementById("shopName").value;
        var shopAddress = document.getElementById("shopAddress").value;
        var shopPhone = document.getElementById("shopPhone").value;
        var shopWard = document.getElementById("shopWard").value;
        var shopType = document.getElementById("shopType").value;

        if (
            shopName === "" ||
            shopAddress === "" ||
            shopPhone === "" ||
            shopWard === "" ||
            shopType === ""
        ) {
            alert("Vui lòng điền đầy đủ thông tin");
            return;
        }

        // Check if phone number is not valid
        if (!shopPhone.match(/^[0-9]{10,11}$/)) {
            alert("Số điện thoại không hợp lệ");
            return;
        }

        fetch(`/shops/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify({
                name: shopName,
                address: shopAddress,
                ward: shopWard,
                phone: shopPhone,
                type: shopType,
            }),
        })
            .then((res) => {
                if (res.status === 201) {
                    alert("Thêm cửa hàng thành công");
                    table.ajax.reload();
                } else {
                    throw new Error("Thêm cửa hàng thất bại");
                }
            })
            .catch((err) => {
                alert(err);
            });
    };
});

document.getElementById("logoutButton").onclick = logout;
