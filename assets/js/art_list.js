$(function() {
    var form = layui.form
    var layer = layui.layer;
    var laypage = layui.laypage;
    //定义一个美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date);
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义不灵的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }
    //定义一个查询的参数对象
    var q = {
        pagenum: 1, // 页码值 默认1
        pagesize: 2, // 每页显示几条数据 默认2
        cate_id: '', // 文章分类的 id
        state: '' // 文章发布的状态
    }
    initTable()

    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                //console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败!')
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)

                //调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    initCate()
        //初始化文章分类
    function initCate() {
        $.ajax({
            method: "GET",
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败')
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }
    //为筛选表单绑定submit
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        //获取表单中选中项 的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // 为查询参数对象 q 中对应 的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        //重新渲染数据
        initTable()
    })

    //定义渲染分页 的方法
    function renderPage(total) {
        //调用render方法渲染分页
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip', ],
            limits: [2, 3, 5, 10],
            // 分页发生切换 触发jump回调
            //chufajump的回调有两种
            //1.点击页码时  2.只要调用 laypage.render就会 触发jump回调
            jump: function(obj, first) {
                //把最新的页码值 赋值到q这个查询对象中
                // console.log(obj.curr);
                q.pagenum = obj.curr
                    //把最新的条目数赋值到q的pagesize
                q.pagesize = obj.limit
                    //根据最新的q 获取对应的数据列表 渲染表格
                if (!first) {
                    initTable()
                }
            },

        })
    }
    //删除事件
    $('tbody').on('click', '.btn-delete', function() {
        //获取删除按钮个数
        var len = $('.btn-delete').length
            //获取id
        var id = $(this).attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: "/my/article/delete/" + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败');
                    }
                    layer.msg('删除文章成功');
                    //当数据删除完成后 需要判断当前这一页是否还有数据 没有数据 页码值-1 在调用initTable方法
                    if (len == 1) {
                        //如果len===1 证明删除完毕 页面上没有数据
                        //页码值最小为1
                        q.pagenum = q.pagenum === 1 ? 1 : pagenum - 1
                    }
                    initTable()
                }
            })
        })
    })
    $('tbody').on('click', '#btn-fabu', function() {
        var id = $(this).attr('data-id');
        localStorage.setItem('id', id)
        location.href = '/user/art_repub.html'
    })
})