$(document).ready(function () {
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
            }
        ]
    });

    $('#updateAcc').click(function () {
        var data = table.rows('.selected').data();
        if (data == undefined) {
            $("#updateAccModal").modal('hide');
            alert("Chưa chọn tài khoản cần cập nhật");
            return;
        }
        
        // do duongoku things
    });

    $("#updateAccModal").on('shown.bs.modal', function () {
        $("#updateAccModal").find("#lastName").val("");
        $("#updateAccModal").find("#firstName").val("");
        $("#updateAccModal").find("#ward").val("");
        $("#updateAccModal").find("#password").val("");

        var data = table.row('.selected').data();
        console.log(data);
        if (data == undefined) {
            $("#updateAccModal").modal('hide');
            alert("Chưa chọn tài khoản cần cập nhật");
            return;
        }
        $("#updateAccModal").find("#lastName").val(data.lastName);
        $("#updateAccModal").find("#firstName").val(data.firstName);
        $("#updateAccModal").find("#ward").val(data.ward);
        $("#updateAccModal").find("#permission").val(data.permissionFlags);
    })
});

document.getElementById("logoutButton").onclick = logout;
