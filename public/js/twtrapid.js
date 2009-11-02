$(function () {
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
      case 'j': select_next_status(); break;
      case 'k': select_prev_status(); break;
      case 'u': update(); break;
      case 'r': reply(); break;
      case 'R': retweet(); break;
      case 'f': favorite(); break;
      case 'o': open_link(); break;
    default:
        /* do nothing */
    }
}

function get_friends_timeline() {
    var last_status_id = $('.status:first').attr('id');
    var params = (last_status_id) ? {since_id: last_status_id} : {};
    $.getJSON('/friends_timeline', params, function (data) {
        if (data.length == 0) return;

        sort_by_status_id(data);
        $.each(data, function (i, status) {
            insert_status(status);
        });
    });
}

function update() {
    var msg = prompt('What are you doing?');
    if (msg) $.post('/update', {status: msg});
}

function reply() {
    var current_status = $('.status.current');
    if (current_status.length == 0) return;

    var current_id = current_status.attr('id');
    var name = unlink_text(current_status.find('.name').html());
    var text = unlink_text(current_status.find('.status-body').html());

    var msg = prompt('Reply to ' + name + ': ' + text);
    if (msg) {
        msg = '@' + name + ' ' + msg;
        $.post('/update', {status: msg, in_reply_to_status_id: current_id});
    }
}

function retweet() {
    var current_status = $('.status.current');
    if (current_status.length == 0) return;

    var name = unlink_text(current_status.find('.name').html());
    var text = unlink_text(current_status.find('.status-body').html());

    var msg = prompt('Retweet of ' + name + ': ' + text);
    msg = msg ? msg + ' ' : '';
    msg = msg + 'RT @' + name + ': ' + text;
    $.post('/update', {status: msg});
}

function favorite() {
    var current_status = $('.status.current');
    if (current_status.length == 0) return;

    var current_id = current_status.attr('id');
    $.post('/favorites_create', {id: current_id}, function () {
        alert('favorited!');
    });
}

function open_link() {
    $('.status.current a.status-link').each(function () {
        window.open($(this).attr('href'));
    });
}

function select_next_status() {
    var current_status = $('.status.current');
    if (current_status.length == 0) {
        select_status($('.status:first'));
        return;
    }

    if (current_status.attr('id') == $('.status:last').attr('id')) {
        return;
    }
    unselect_status(current_status);

    var next_status = current_status.next();
    select_status(next_status);
}

function select_prev_status() {
    var current_status = $('.status.current');
    if (current_status.length == 0) {
        select_status($('.status:first'));
        return;
    }

    if (current_status.attr('id') == $('.status:first').attr('id')) {
        return;
    }
    unselect_status(current_status);

    var prev_status = current_status.prev();
    select_status(prev_status);
}

function select_status(status_jquery) {
    status_jquery.addClass('ui-state-highlight current');

    var o = ($(window).height() - status_jquery.height()) / 2;
    $.scrollTo(status_jquery, 0, {axis: 'y', offset: -o});
}

function unselect_status(status_jquery) {
    status_jquery.removeClass('ui-state-highlight current');
}

function insert_status(status_jquery) {
    format_status(status_jquery).prependTo('#output');
}

function format_status(status_json) {
    var status = $('<div class="ui-widget-content ui-corner-all status">')
        .attr('id', status_json.id);

    var icon_container = $('<div class="icon-container">')
        .append(
            $('<img class="icon">')
                .attr('src', status_json.user.profile_image_url)
                .attr('alt', status_json.user.screen_name)
        );

    var name = status_json.user.screen_name.replace(
            /(.*)/, "<a href=\"http://twitter.com/$1\" target=\"_blank\">$1</a>");
    $('<div class="ui-helper-clearfix status-header">')
        .append(
            icon_container
        ).append(
            $('<div class="name">')
                .html(name)
        ).appendTo(status);

    var text = link_text(status_json.text);
    $('<div class="status-body">').html(text).appendTo(status);

    return status;
}

function link_text(text) {
    var linked_text = text.replace(/(https?:\/\/[\w-.!~*'();/?:@&=+$,%#]+)/g,
                        "<a href=\"$1\" class=\"status-link\" target=\"_blank\">$1</a>");
    linked_text = linked_text.replace(/@(\w+)/g,
                        "<a href=\"http://twitter.com/$1\" target=\"_blank\">@$1</a>");
    return linked_text;
}

function unlink_text(text) {
    return text.replace(/<[^>]*>/g, '');
}

function sort_by_status_id(data) {
    data.sort(function (s1, s2) {
        return s1.id - s2.id;
    });
}
