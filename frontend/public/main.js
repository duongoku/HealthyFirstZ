document.writeln(`<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>`)
document.writeln(`<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js" integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p" crossorigin="anonymous"></script>`)
document.writeln(`<script type="text/javascript" src="https://code.jquery.com/jquery-3.5.1.js"></script>`)
document.writeln(`<script type="text/javascript" src="https://cdn.datatables.net/1.12.1/js/jquery.dataTables.min.js"></script>`)
document.writeln(`<script type="text/javascript" src="https://cdn.datatables.net/1.12.1/js/dataTables.bootstrap5.min.js"></script>`)

function formatDate(data, spaces) {
    function appendZero(n) {
        if(n <= 9) {
            return "0" + n;
        }

        return n;
    }

    let date = new Date(data);
    let res = appendZero(date.getHours()) + ':' + appendZero(date.getMinutes());

    while(spaces--) {
        res += '\xa0';
    }

    res += appendZero(date.getDate()) + '/' + appendZero(date.getMonth() + 1) + '/' + date.getFullYear();

    return res;
}

function logout() {
    window.location.href = "../login/login.html";
}
