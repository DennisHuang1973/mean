/**
 * Created by DennisHuang on 15/08/18.
 */

(function($, window){
    'user strict';

    function users(){
        var self = this ;
        this.addUser = function(){
            var username = $('#username').val();
            var password = $('#password').val();
            $.ajax({
                url: '/users',
                type: 'PUT',
                data: {username: username, password: password},
                success: function (data) {
                    if (data.result){
                        window.location.href='/users';
                        return false ;
                    }
                    else {
                        alert(data.message);
                    }
                }
            })
        };

        this.delUser = function(id) {
            //var index = e.attributes["index"].value;
            $.ajax({
                url: '/users',
                type: 'DELETE',
                data: {id: id},
                success: function (data) {
                    if (data.result) {
                        window.location.reload();
                    }
                    else {
                        alert(data.message);
                    }
                }
            })
        };

    };


    $(document).ready(function () {
        window.users = new users() ;

    });

})(jQuery, window);