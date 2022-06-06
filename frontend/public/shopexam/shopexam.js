// customize datatable
$(document).ready(function () {
    var table = $('#examTable').DataTable({
        searching: true,
        ajax: "../data/examinations.json",
        columns: [
            { data: 'shop_id' },
            { data: 'from' },
            { data: 'to' },
            { data: 'status' },
            { data: 'test_id' }
        ],
        columnDefs: [
            {
                targets: 0,
                render: function (data, type, row, meta) {
                    // convert shop_id to shopname
                    if (type === 'display') {
                        
                        // get shopname from shop_id
                        var shopname = "";
                        $.ajax({
                            url: "../data/shops.json",
                            async: false,
                            success: function (shops) {
                                $.each(shops, function (index, value) {
                                    //console.log(row['shop_id']);
                                    ids = [];
                                    for (let i = 0; i < shops.data.length; i++) {
                                        ids.push(shops.data[i]._id);
                                    }

                                    let tmp = ids.indexOf(row['shop_id'])
                                    if (tmp != -1) {
                                        shopname = shops.data[tmp].name;
                                    }
                                });
                            }
                        });
                        
                        return $('<a>')
                            .attr('href', '../shopinfo/shopinfo.html') // do duongoku things
                            .text(shopname)
                            .wrap('<div></div>')
                            .parent()
                            .html();

                    } else {
                        return data;
                    }
                }
            },
            {
                targets: 4,
                render: function (data, type, row, meta) {
                    // convert test_id to status
                    if (type === 'display') {
                        var testname = "";
                        $.ajax({
                            url: "../data/tests.json",
                            async: false,
                            success: function (tests) {
                                $.each(tests, function (index, value) {
                                    //console.log(row['shop_id']);
                                    ids = [];
                                    for (let i = 0; i < tests.data.length; i++) {
                                        ids.push(tests.data[i]._id);
                                    }

                                    let tmp = ids.indexOf(row['test_id'])
                                    if (tmp != -1) {
                                        testname = tests.data[tmp].status;
                                    }
                                });
                            }
                        });
                        return $('<a>')
                            .attr('href', '../testinfo/testinfo.html') // do duongoku things
                            .text(testname)
                            .wrap('<div></div>')
                            .parent()
                            .html();
                    } else {
                        return data;
                    }
                }
            },
            {
                targets: 1,
                render: function (data, type, row, meta) {
                    if (type === 'display') {
                        return formatDate(data, 2);
                    } else {
                        return data;
                    }
                }
            },
            {
                targets: 2,
                render: function (data, type, row, meta) {
                    if (type === 'display') {
                        return formatDate(data, 2);
                    } else {
                        return data;
                    }
                }
            }
        ]
    });
});