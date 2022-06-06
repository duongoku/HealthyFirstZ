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

    console.log(shops);
    console.log(tests);

    const table = $("#examTable").DataTable({
        searching: true,
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
                        let shopname = row.shop_id;
                        for (let i = 0; i < shops.length; i++) {
                            if (shops[i]._id === data) {
                                shopname = shops[i].name;
                                break;
                            }
                        }
                        return $("<a>")
                            .attr("href", `/shopinfo/${data}`)
                            .text(shopname)
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
                        let testresult = row.test_id;
                        for (let i = 0; i < tests.length; i++) {
                            if (tests[i]._id === data) {
                                testresult = tests[i].status;
                                break;
                            }
                        }
                        return $("<a>")
                            .attr("href", `/testinfo/${data}`)
                            .text(testresult)
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
});
