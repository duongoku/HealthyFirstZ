async function checkAdmin() {
    await fetch(`/users/${localStorage.getItem("currentUser")}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.permissionFlags === 1) {
                alert("You are not authorized to view this page");
                window.location.href = "/home";
            }
        })
        .catch((err) => {
            console.log(err);
            alert("Something went wrong");
            window.location.href = "/home";
        });
}

$(document).ready(async function () {
    await checkAdmin();
    document.getElementById("logoutButton").onclick = logout;
    var table = $("#adminTable").DataTable({
        searching: true,
        select: true,
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
        columns: [
            { data: "email" },
            { data: "lastName" },
            { data: "firstName" },
            { data: "ward" },
            { data: "permissionFlags" },
        ],
        columnDefs: [
            {
                targets: 4,
                render: function (data, type, row, meta) {
                    // navigate to shop page
                    if (type === "display") {
                        return data === 1 ? "Chuyên viên" : "Quản lý hệ thống";
                    } else {
                        return data;
                    }
                },
            },
        ],
    });

    $("#updateAcc").click(function () {
        var data = table.row(".selected").data();
        if (data == undefined) {
            $("#updateAccModal").modal("hide");
            alert("Chưa chọn tài khoản cần cập nhật");
            return;
        }
        const perm = $("#updateAccModal").find("#permission").val();
        const updatedUser = {
            email: data.email,
            password: $("#updateAccModal").find("#password").val(),
            ward: $("#updateAccModal").find("#ward").val(),
            firstName: $("#updateAccModal").find("#firstName").val(),
            lastName: $("#updateAccModal").find("#lastName").val(),
            permissionFlags: parseInt(perm),
        };
        if (updatedUser.password === "") {
            delete updatedUser.password;
        }
        fetch(`/users/${data._id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify(updatedUser),
        })
            .then((res) => {
                if (res.status === 204) {
                    alert("Cập nhật thành công");
                    $("#updateAccModal").modal("hide");
                    table.ajax.reload();
                } else {
                    throw new Error("Cập nhật thất bại");
                }
            })
            .catch((err) => {
                alert(err);
            });
    });

    $("#updateAccModal").on("shown.bs.modal", function () {
        $("#updateAccModal").find("#lastName").val("");
        $("#updateAccModal").find("#firstName").val("");
        $("#updateAccModal").find("#ward").val("");
        $("#updateAccModal").find("#password").val("");

        var data = table.row(".selected").data();
        if (data == undefined) {
            $("#updateAccModal").modal("hide");
            alert("Chưa chọn tài khoản cần cập nhật");
            return;
        }
        $("#updateAccModal").find("#lastName").val(data.lastName);
        $("#updateAccModal").find("#firstName").val(data.firstName);
        $("#updateAccModal").find("#ward").val(data.ward);
        $("#updateAccModal")
            .find("#permission")
            .val(data.permissionFlags === 1 ? "1" : "3");
    });

    $("#addAcc").click(function () {
        var email = $("#addAccModal").find("#addemail").val();
        var lastName = $("#addAccModal").find("#addlastName").val();
        var firstName = $("#addAccModal").find("#addfirstName").val();
        var ward = $("#addAccModal").find("#addward").val();
        var password = $("#addAccModal").find("#addpassword").val();
        var permission = $("#addAccModal").find("#addpermission").val();

        if (
            email === "" ||
            lastName === "" ||
            firstName === "" ||
            ward === ""
        ) {
            alert("Không được để trống các trường");
            return;
        }
        var data = table.data();
        for (var i = 0; i < data.length; i++) {
            if (data[i].email === email) {
                alert("Email đã tồn tại");
                return;
            }
        }
        if (password.length < 15) {
            alert("Mật khẩu phải có ít nhất 15 ký tự");
            return;
        }

        fetch(`/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify({
                email: email,
                password: password,
                ward: ward,
                firstName: firstName,
                lastName: lastName,
                permissionFlags: parseInt(permission),
            }),
        })
            .then((res) => {
                if (res.status === 201) {
                    alert("Tạo người dùng thành công");
                    $("#addAccModal").modal("hide");
                    table.ajax.reload();
                } else {
                    if (res.body.error) {
                        throw new Error("Tạo người dùng thất bại");
                    }
                }
            })
            .catch((err) => {
                alert(err);
            });
    });

    $("#delAccModal").on("shown.bs.modal", function () {
        var data = table.row(".selected").data();
        if (data == undefined) {
            $("#delAccModal").modal("hide");
            alert("Chưa chọn tài khoản cần xóa!");
            return;
        }
    });

    $("#delAcc").click(function () {
        alert("Đã xóa tài khoản");
        // do duongoku things
    });
});

document.getElementById("logoutButton").onclick = logout;
