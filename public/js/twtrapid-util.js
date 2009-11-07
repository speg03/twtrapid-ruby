var TwtrapidUtil = {
    create_link: function (text) {
        var linked_text = text;
        linked_text = this.create_http_link(linked_text);
        linked_text = this.create_user_link(linked_text);
        linked_text = this.create_hashtag_link(linked_text);

        return linked_text;
    },

    create_http_link: function (text) {
        return text.replace(
            /(https?:\/\/[\w-.!~*'();/?:@&=+$,%#]+)/g,
            "<a href=\"$1\" target=\"_blank\">$1</a>"
        );
    },

    create_user_link: function (text) {
        return text.replace(
            /@(\w+)/g,
            "@<a href=\"http://twitter.com/$1\" target=\"_blank\">$1</a>"
        );
    },

    create_hashtag_link: function (text) {
        return text.replace(
            /#(\w+)/g,
            "<a href=\"http://twitter.com/#search?q=%23$1\" target=\"_blank\">#$1</a>"
        );
    },

    untag: function (text) {
        return text.replace(/<[^>]*>/g, '');
    }
};
