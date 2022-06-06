const testId = document.getElementById("testId").value;

fetch(`/tests/${testId}`, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
    },
})
    .then((response) => {
        return response.json();
    })
    .then((cur) => {
        let header = document.createElement("div");
        header.classList.add("card-header");
        header.innerHTML = "<b>Hoạt động thanh tra</b>";

        let body = document.createElement("div");
        body.classList.add("card-body");
        let tmp_1 =
            "<div class='row' style='padding: 5px;'><div class='col-sm-4'>";
        let tmp_2 = ": </div> <div class='col-sm-6'>";
        let tmp_3 = "</div></div>";

        body.innerHTML =
            tmp_1 + "Ngày thực hiện" + tmp_2 + formatDate(cur.taken, 1) + tmp_3;

        body.innerHTML += tmp_1 + "Trạng thái" + tmp_2 + cur.status + tmp_3;

        let result = "";
        if (cur.result === "Đạt") {
            result = "<span class='text-success'>Đạt</span>";
        } else {
            result = "<span class='text-danger'>Không đạt</span>";
        }
        body.innerHTML += tmp_1 + "Kết quả" + tmp_2 + result + tmp_3;

        body.innerHTML +=
            tmp_1 + "Đơn vị xử lý" + tmp_2 + cur.processing_unit + tmp_3;

        body.innerHTML +=
            tmp_1 +
            "Ngày trả kết quả" +
            tmp_2 +
            formatDate(cur.result_date, 1) +
            tmp_3;

        document.querySelector(".card").innerHTML = "";
        document.querySelector(".card").appendChild(header);
        document.querySelector(".card").appendChild(body);
    });
