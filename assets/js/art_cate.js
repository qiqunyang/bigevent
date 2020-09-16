$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initArtCateList()

    function initArtCateList() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    var indexAdd = null;
    //为添加分类注册点击事件
    $('#btnaddCate').on('click', function() {
            indexAdd = layer.open({
                type: 1,
                area: ['500px', '250px'],
                title: '添加文章分类',
                content: $('#dialog-add').html(),
            })
        })
        //通过代理的形式 绑定submit事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败!');
                }
                initArtCateList()
                layer.msg('新增分类成功!');

                //关闭弹出层
                layer.close(indexAdd);
            }
        })
    })
    var indexEdit = null;
    //通过代理的形式 为编辑绑定点击事件
    $('tbody').on('click', '#btn-edit', function() {
        //弹出修改信息层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html(),
        })
        var id = $(this).attr('data-id')
            // console.log(id);
        $.ajax({
            method: "GET",
            url: "/my/article/cates/" + id,
            success: function(res) {
                form.val('form-edit', res.data)
            }
        })
    })
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('修改分类失败!');
                }

                layer.msg('修改分类成功!');

                //关闭弹出层
                layer.close(indexEdit);
                //刷新数据
                initArtCateList()
            }
        })
    })



    //通过代理形式 为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //console.log(id);
            $.ajax({
                method: "GET",
                url: "/my/article/deletecate/" + id,
                success: function(res) {

                    if (res.status !== 0) {
                        return layer.msg('删除分类失败!');
                    }
                    layer.close(id);
                    layer.msg('删除分类成功!');
                    initArtCateList()
                }
            })
        })
    })

})