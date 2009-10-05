var last_status_id;

$(document).ready(function () {
    get_friends_timeline();
    setInterval(function () {
        get_friends_timeline();
    }, 60 * 1000);

    $(document).keypress(function (e) {
        execute_command(String.fromCharCode(e.which));
    });
});

function execute_command(ch) {
    switch (ch) {
    case 'j':
        break;
    case 'k':
        break;
    case 'u':
        var status = prompt();
        if (status) update_status(status);
        break;
    default:
        /* do nothing */
    }
}

function update_status(s) {
    $.post('/statuses/update.json', {status: s});
}

function get_friends_timeline() {
    var params = (last_status_id) ? { since_id: last_status_id } : {};
    $.getJSON('/statuses/friends_timeline.json', params, function (data) {
        last_status_id = data[0].id;

        sort_by_status_id(data);
        $.each(data, function (i, status) {
            insert_status(status);
        });
    });
}

function insert_status(status) {
    format_status(status).appendTo('#output');
}

function format_status(status) {
    var status_line = $('<div class="status" />');
    status_line.attr('id', status.id);
    $('<span class="name" />').text(status.user.screen_name).appendTo(status_line);
    $('<span class="text" />').html(': ' + status.text).appendTo(status_line);

    return status_line;
}

function sort_by_status_id(data) {
    data.sort(function (s1, s2) {
        return s1.id - s2.id;
    });
}
