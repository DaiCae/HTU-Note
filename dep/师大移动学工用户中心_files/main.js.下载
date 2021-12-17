$(document).ready(function () {

    /* url  navigation active */
    var url = window.location;

    function menuitems() {
        var element = $('.sidebar .navbar .nav-item a').filter(function () {
            return this.href == url;
            console.log(url)
        }).addClass('active').closest(".dropdown-menu").addClass('show').closest("li.dropdown").addClass('show');
    }

    menuitems();
    if(typeof(gconfig)!='undefined')
    inileftmenu();

    /* sidebar left  expand collapase */
    $('.menu-left').on('click', function () {
        $('body').addClass('menu-left-open');
        $('body .wrapper').append('<div class="backdrop"></div>');
        $('.backdrop').on('click', function () {
            $('body').removeClass('menu-left-open');
            $('.backdrop').fadeOut().remove();
        });
    });

    $('.sidebar-close').on('click', function () {
        $('body').removeClass('menu-left-open');
        $('.backdrop').fadeOut().remove();
    });

    /* sideabr right expand collapase */
    $('.menu-right').on('click', function () {
        $('body').addClass('menu-right-open')
        $('body .wrapper').append('<div class="backdrop-right"></div>');
        $('.backdrop-right, .menu-left-close').on('click', function () {
            $('body').removeClass('menu-right-open');
            $('.backdrop-right').fadeOut().remove();
        });
    });

    /* search control visible slide hide slide */
    $('.searchbtn').on('click', function () {
        $('.searchcontrol').addClass('active');
    });
    $('.close-search').on('click', function () {
        $('.searchcontrol').removeClass('active');
    });

    /* page content height for sticky footer */
    $('.content-sticky-footer').css({
        'padding-bottom': ($('.footer-wrapper').height() + 35)
    });
    //$('.footer-wrapper').css('margin-top', -($('.footer-wrapper').height() + 20));

});

function inileftmenu() {
    var _menutpl = '<div class="profile-link"><a href="#" class="media"><div class="w-auto h-100"><figure class="avatar avatar-40"><i class="la la-user" style="font-size:40px"></i></figure></div><div class="media-body"><h5 class=" mb-0"><%= uname%> <span class="status-online bg-success"></span></h5><p><%= role%></p></div></a></div>\
<nav class="navbar"><ul class="navbar-nav">\
<% if(role=="teacher"){ %>\
<li class="nav-item"><a href="/teacher/courses">首页</a></li>\
<% if(type=="fdy"){ %>\
<li class="nav-item"><a href="/teacher/menu2">高级管理/基础管理</a></li>\
<% }else{ %>\
<li class="nav-item"><a href="/teacher/ptiku/subjects">自建题库管理</a></li>\
<% } %>\
<li class="nav-item"><a href="/teacher/bgtask">后台任务进度</a></li>\
<% } %>\
<% if(role=="student"){ %>\
<li class="nav-item">\
<a href="/student/courses"> 首页</a>\
</li>\
<li class="nav-item">\
<a href="/student/detail"> 个人资料</a>\
</li>\
<% } %>\
<li class="nav-item"><a href="/<%= role%>/account?from=menu"> 账户设置/解绑</a></li><li class="nav-item"><a href="/clearcache.php?ref=/<%= role%>"> 清空登录缓存</a></li><li class="nav-item"><a href="/<%= role%>/password"> 修改密码</a></li></ul></nav>';
$('#leftmenuarea').html(tpl2html(_menutpl, gconfig));
}
