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
})

// customize datatable
$(document).ready(function () {
    var table = $('#shoptable').DataTable({
        searching: true,
        ajax: "../data/shops.json",
        columns: [
            { data: 'name' },
            { data: 'type' },
            { data: 'isValid' },
            { data: 'validBefore' }
        ],
        columnDefs: [
            {
                targets: 0,
                render: function(data, type, row, meta) {
                    // navigate to shop page
                    if(type === 'display'){
                        return $('<a>')
                            .attr('href', '../shopinfo/shopinfo.html') // do duongoku things
                            .text(data)
                            .wrap('<div></div>')
                            .parent()
                            .html();
                    } else {
                        return data;
                    }
                }
            },
            {
                targets: 2,
                render: function(data, type, row, meta) {
                    // change color of certificate
                    if (row['validBefore'] !== null && new Date(row['validBefore']) < new Date()) {
                        return $('<span>')
                            .attr('class', 'text-warning')
                            .text("Hết hiệu lực")
                            .wrap('<div></div>')
                            .parent()
                            .html();
                    }

                    if (data) {
                        return $('<span>')
                            .attr('class', 'text-success')
                            .text("Còn hiệu lực")
                            .wrap('<div></div>')
                            .parent()
                            .html();
                    } else if (data === false) {
                        return $('<span>')
                            .attr('class', 'text-danger')
                            .text("Đã bị thu hồi")
                            .wrap('<div></div>')
                            .parent()
                            .html();
                    } else if (data === null) {
                        return $('<span>')
                            .attr('class', 'text-danger')
                            .text("Không có")
                            .wrap('<div></div>')
                            .parent()
                            .html();
                    }
                }
            },
            {
                targets: 3,
                render: function(data, type, row, meta) {
                    // reformat date time
                    if (row['isValid'] === null || data === null) {
                        return ' ';
                    }

                    if (type === 'display') {
                        return formatDate(data, 2);
                    } else {
                        return data;
                    }
                }
            }
        ]
    });

    $('#select').on('change', function () {
        console.log("keyup");
        table.draw();
    })
});
