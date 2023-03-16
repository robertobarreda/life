const birthday = '1985-11-08';
const totalYears = 90;

window.addEventListener('load', function() {
    document.getElementById("unitbox").setAttribute("onchange", "repaint()");
    repaint();
});

function repaint() {
    _repaintItems(calculateElapsedTime(), calculateTotalTime());
}

function calculateElapsedTime() {
    var unitText = _viewMode();
    var birthDate = _birthDate();
    var today = moment();

    return today.diff(birthDate, unitText);
}

function calculateTotalTime() {
    var unitText = _viewMode();

    switch (unitText) {
      case 'days':
        return (totalYears * 365);
      case 'weeks':
        return (totalYears * 52);
      case 'months':
        return (totalYears * 12);
      case 'years':
        return totalYears;
    }
}

function _repaintItems(current, total) {
    var elements = []
    for (var i = 0; i < total; i++) {
        var el = document.createElement('li');
        if (i < current) el.classList.add("done");
        elements.push(el);
    }

    var mode = _viewMode();
    var container = document.getElementById('chart');
    container.replaceChildren(...elements);
    container.className = 'chart group';
    container.classList.add(mode);

    _viewLived(current, mode);
    _viewBirthday();
}

function _viewLived(current, mode) {
    document.getElementById('lived').innerHTML = `${current} ${mode}`;
}

function _viewBirthday() {
    var birthDate = _birthDate();
    var today = moment();
    if (_isBirthday(today, birthDate)) {
        document.getElementById('age').innerHTML = getOrdinal(today.diff(birthDate, 'years'));
        document.getElementById('birthday-msg').className = '';
    } else {
        document.getElementById('birthday-msg').className = 'hidden';
    }
}

function _birthDate() {
    return moment(window.location.hash.substring(1) || birthday);
}

function _isBirthday(m1, m2){
    return m1.date() === m2 .date() && m1.month() === m2.month()
}

function _viewMode() {
    return document.querySelector('.unitbox').value.toLowerCase();
}
