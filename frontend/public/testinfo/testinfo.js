const testId = document.getElementById("testId").value;

var bigCur;

async function loadTest() {
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
            bigCur = cur;
            let header = document.createElement("div");
            header.classList.add("card-header");
            header.innerHTML = "<b>Hoạt động kiểm định</b>";

            let body = document.createElement("div");
            body.classList.add("card-body");
            let tmp_1 =
                "<div class='row' style='padding: 5px;'><div class='col-sm-4'>";
            let tmp_2 = ": </div> <div class='col-sm-6'>";
            let tmp_3 = "</div></div>";

            body.innerHTML =
                tmp_1 +
                "Ngày thực hiện" +
                tmp_2 +
                formatDate(cur.taken, 1) +
                tmp_3;
            

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
}

async function updateTest() {
    let dateAt = document.getElementById("dateAt").value;
    let timeAt = document.getElementById("timeAt").value;
    let combinedTimeAt = `${dateAt}T${timeAt}:00.000Z`;

    let dateReturn = document.getElementById("dateReturn").value;
    let timeReturn = document.getElementById("timeReturn").value;
    let combinedTimeReturn = `${dateReturn}T${timeReturn}:00.000Z`;

    const status = document.getElementById("status").value;

    const result = document.getElementById("result").value;

    const unit =
        document.getElementById("unit").value === ""
            ? "Chưa xác định"
            : document.getElementById("unit").value;

    fetch(`/tests/${testId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
        body: JSON.stringify({
            taken: combinedTimeAt,
            status: status,
            result: result,
            processing_unit: unit,
            result_date: combinedTimeReturn,
        }),
    })
        .then((response) => {
            if (response.status === 204) {
                alert("Đã cập nhật kết quả kiểm định!");
                loadTest();
            } else {
                alert("Cập nhật thất bại!");
            }
        })
        .catch((err) => {
            console.log(err);
            alert("Cập nhật thất bại!");
        });
}

document.getElementById("updateResult").addEventListener("shown.bs.modal", function() {
    var curTaken = formatDate(bigCur.taken, 1);
    curTaken = curTaken.split('\xa0');
    curTakenDate = curTaken[1].split('/');
    
    var curRes = formatDate(bigCur.result_date, 1);
    curRes = curRes.split('\xa0');
    curResDate = curRes[1].split('/');

    document.getElementById("dateAt").value = curTakenDate[2] + "-" + curTakenDate[1] + "-" + curTakenDate[0];
    document.getElementById("timeAt").value =  curTaken[0];

    document.getElementById("dateReturn").value = curResDate[2] + "-" + curResDate[1] + "-" + curResDate[0];
    document.getElementById("timeReturn").value = curRes[0];

    document.getElementById("status").value = bigCur.status;
    document.getElementById("result").value = bigCur.result;
    document.getElementById("unit").value = bigCur.processing_unit;
});

document.getElementById("logoutButton").onclick = logout;

document.getElementById("updateResultBtn").onclick = updateTest;

loadTest();