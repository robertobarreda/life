const birthday = '1985-11-08';
const totalYears = 90;

window.addEventListener('load', function() {
    document.getElementById("unitbox").addEventListener("change", repaint);
    repaint();
});

function repaint() {
    var unitText = _viewMode();
    var birthDate = _birthDate();
    _repaintItems(calculateElapsedTime(unitText, birthDate), calculateTotalTime(unitText, birthDate), unitText, birthDate);
}

function calculateElapsedTime(unitText, birthDate) {
    var today = moment();
    return today.diff(birthDate, unitText);
}

function calculateTotalTime(unitText, birthDate) {
    var futureDate = moment(birthDate).add(totalYears, 'years');
    return futureDate.diff(birthDate, unitText);
}

function _repaintItems(current, total, mode, birthDate) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < total; i++) {
        var el = document.createElement('li');
        if (i < current) el.classList.add("done");
        fragment.appendChild(el);
    }

    var container = document.getElementById('chart');
    container.replaceChildren(fragment);
    container.className = 'chart group';
    container.classList.add(mode);

    _viewLived(current, mode);
    _viewBirthday(birthDate);
}

function _viewLived(current, mode) {
    document.getElementById('lived').innerHTML = `${current}`;
}

function _viewBirthday(birthDate) {
    var today = moment();
    if (_isBirthday(today, birthDate)) {
        document.getElementById('age').innerHTML = getOrdinal(today.diff(birthDate, 'years'));
        document.getElementById('birthday-msg').className = '';
    } else {
        document.getElementById('birthday-msg').className = 'hidden';
    }
}

function getOrdinal(n) {
    var s = ["th", "st", "nd", "rd"];
    var v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function _birthDate() {
    return moment(window.location.hash.substring(1) || birthday);
}

function _isBirthday(m1, m2){
    return m1.date() === m2.date() && m1.month() === m2.month()
}

function _viewMode() {
    return document.querySelector('.unitbox').value.toLowerCase();
}
