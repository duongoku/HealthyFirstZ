// customize datatable
$(document).ready(async function () {
    var shops = [];
    var tests = [];

    try {
        shops = await fetch(
            `/shops/managedby/${localStorage.getItem("currentUser")}/0/999999`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        "Bearer " + localStorage.getItem("accessToken"),
                },
            }
        );
        shops = await shops.json();
        shops = shops.data;
        tests = await fetch(`/tests/page/0/limit/999999`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("accessToken"),
            },
        });
        tests = await tests.json();
    } catch (error) {
        console.log(error);
    }

    const table = $("#examTable").DataTable({
        searching: true,
        select: true,
        ajax: {
            url: `/examinations/managedby/${localStorage.getItem(
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
            { data: "shop_id" },
            { data: "from" },
            { data: "to" },
            { data: "status" },
            { data: "test_id" },
        ],
        columnDefs: [
            {
                targets: 0,
                render: function (data, type, row, meta) {
                    if (type === "display") {
                        for (let i = 0; i < shops.length; i++) {
                            if (shops[i]._id === data) {
                                row.shop_id = shops[i].name;
                                break;
                            }
                        }
                        return $("<a>")
                            .attr("href", `/shopinfo/${data}`)
                            .text(row.shop_id)
                            .wrap("<div></div>")
                            .parent()
                            .html();
                    } else {
                        return data;
                    }
                },
            },
            {
                targets: 4,
                render: function (data, type, row, meta) {
                    if (type === "display") {
                        for (let i = 0; i < tests.length; i++) {
                            if (tests[i]._id === data) {
                                row.test_id = tests[i].status;
                                break;
                            }
                        }
                        return $("<a>")
                            .attr("href", `/testinfo/${data}`)
                            .text(row.test_id)
                            .wrap("<div></div>")
                            .parent()
                            .html();
                    } else {
                        return data;
                    }
                },
            },
            {
                targets: 1,
                render: function (data, type, row, meta) {
                    if (type === "display") {
                        return formatDate(data, 2);
                    } else {
                        return data;
                    }
                },
            },
            {
                targets: 2,
                render: function (data, type, row, meta) {
                    if (type === "display") {
                        return formatDate(data, 2);
                    } else {
                        return data;
                    }
                },
            },
        ],
    });

    $("#delExamModal").on("shown.bs.modal", function () {
        var data = table.row(".selected").data();
        if (data == undefined) {
            $("#delExamModal").modal("hide");
            alert("Ch??a ch???n ho???t ?????ng thanh tra c???n x??a!");
            return;
        }
    });

    $("#delExam").on("click", function () {
        var data = table.row(".selected").data();

        fetch(`/examinations/${data._id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        }).then((res) => {
            if (res.status === 204) {
                alert("X??a ho???t ?????ng th??nh c??ng");
                table.ajax.reload();
            } else {
                throw new Error("X??a ho???t ?????ng th???t b???i");
            }
        });
    })
});

document.getElementById("logoutButton").onclick = logout;
