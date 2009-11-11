function TwtrapidStatus(status_jquery) {
    this.jquery = status_jquery;
}

TwtrapidStatus.prototype.id = function () {
    return this.jquery.attr('id');
};

TwtrapidStatus.prototype.name = function () {
    return TwtrapidUtil.untag(this.jquery.find('.name').html());
};

TwtrapidStatus.prototype.text = function () {
    return TwtrapidUtil.untag(this.jquery.find('.status-body').html());
};

TwtrapidStatus.prototype.urls = function () {
    var urls = new Array();
    this.jquery.find('.status-body a').each(function () {
        if ($(this).text().match(/^https?:\/\//)) {
            urls.push($(this).attr('href'));
        }
    });
    return urls;
};

TwtrapidStatus.prototype.is_selected = function () {
    return this.jquery.hasClass('current');
};

TwtrapidStatus.prototype.set_selected = function (state) {
    if (state) {
        this.jquery.addClass('ui-state-highlight current');
    }
    else {
        this.jquery.removeClass('ui-state-highlight current');
    }
};

TwtrapidStatus.prototype.is_favorited = function () {
    return this.jquery.find('.favorite').hasClass('ui-state-active');
};

TwtrapidStatus.prototype.set_favorited = function (state) {
    var s = this.jquery.find('.favorite');
    if (state) {
        s.removeClass('ui-state-default');
        s.addClass('ui-state-active');
    }
    else {
        s.removeClass('ui-state-active');
        s.addClass('ui-state-default');
    }
};
