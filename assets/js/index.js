$(function(){
    // 调用 getUserInfo 获取用户信息
    getUserInfo();

    //点击退出按钮,实现退出功能
    var layer = layui.layer;
    $('#btnLogout').on('click',function(){
        layer.confirm('确定退出登录?',{icon: 3,title: '提示'},
        function(index){
            //1.清空本地存储
            localStorage.removeItem('token');
            //2.重新跳转页面
            location.href = '/login.html';
            //3.关闭confirm 询问
            layer.close(index);
        })
        
    })
})
//获取用户信息
function  getUserInfo(){
    $.ajax({
        mathod: "GET",
        url: '/my/userinfo',
        //请求头配置对象
        // headers:{
        //     Authorization:localStorage.getItem('token') || ''
        // },
        success: function(res){
            if(res.status !== 0) {
                return layer.msg('获取用户信息失败');
            }
            //调用 renderAvatar 渲染用户头像
            renderAvatar(res.data);
        },
        //不论成功失败都会调用 complete函数
        // complete: function(res){
        //     //console.log(res);
        //     //在complete函数中 可以使用res.responseJSON拿到服务器返回来的数据
        //     if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         //1.强制清空 token
        //         localStorage.removeItem('token');
        //         //2.强制跳转登录页面
        //         location.href = '/login.html';
        //     }
        // }

    })
}
//渲染用户头像
function  renderAvatar(user) {
    //1.获取用户的名称
    var name = user.nickname || user.username;
    //2.设置欢迎文本
    $('#welcome').html("欢迎&nbsp;&nbsp;" + name);
    //3.按需渲染用户头像
    if(user.user_pic !== null) {
        //3.1渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    }else {
        //3.1渲染文本头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}
