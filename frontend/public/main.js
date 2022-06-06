document.writeln(`<script src="/cdn/jquery-3.2.1.slim.min.js"></script>`);
document.writeln(`<script src="/cdn/popper.min.js"></script>`);
document.writeln(`<script src="/cdn/jquery-3.5.1.js"></script>`);
document.writeln(`<script src="/cdn/jquery.dataTables.min.js"></script>`);
document.writeln(`<script src="/cdn/dataTables.bootstrap5.min.js"></script>`);

/**
 * 
 * @param {String} data 
 * @param {Number} spaces 
 * @returns 
 */
function formatDate(data, spaces) {
    if (data[data.length - 1] === "Z") {
        data = data.slice(0, -1);
    }
    function appendZero(n) {
        if (n <= 9) {
            return "0" + n;
        }

        return n;
    }

    let date = new Date(data);
    let res = appendZero(date.getHours()) + ":" + appendZero(date.getMinutes());

    while (spaces--) {
        res += "\xa0";
    }

    res +=
        appendZero(date.getDate()) +
        "/" +
        appendZero(date.getMonth() + 1) +
        "/" +
        date.getFullYear();

    return res;
}

function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("currentUser");
    window.location.href = "/login";
}

// Check if token is in localStorage
if (localStorage.getItem("accessToken") === null || localStorage.getItem("refreshToken") === null || localStorage.getItem("currentUser") === null) {
    window.location.href = "/login";
}