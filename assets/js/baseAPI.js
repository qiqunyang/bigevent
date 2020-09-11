$.ajaxPrefilter(function(options) {
    options.url = 'http://ajax.frontend.itheima.net' + options.url
    //在发起ajax 请求之前统一拼接请求的跟路径
    if(options.url.indexOf('/my') !== -1) {
    //统一为有权限的接口 设置 请求头
        options.headers = {
            Authorization:localStorage.getItem('token') || ''
        }
    }
    //全局统一挂载 complete 回调函数
    options.complete = function(res) {
         //console.log(res);
            //在complete函数中 可以使用res.responseJSON拿到服务器返回来的数据
            if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                //1.强制清空 token
                localStorage.removeItem('token');
                //2.强制跳转登录页面
                location.href = '/login.html';
            }
    }
   
})