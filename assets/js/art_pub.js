$(function() {
    var layer = layui.layer
    var form = layui.form

    initCate()
    initEditor()
        //定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败!');
                }
                //调用模板引擎
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id').html(htmlStr)
                    //调用form方法
                form.render()
            }
        })
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    //为选择封面的按钮注册点击事件
    $('#btnChooseimage').on('click', function() {
            $('#coverFile').click()
        })
        //监听coverFile的change事件 获取用户选择的文件
    $('#coverFile').on('change', function(e) {
            var files = e.target.files[0]
                //判断用户有没有选择文件
            if (files.length == 0) {
                return
            }
            // 根据文件 创建对应的URL地址
            var newImgURL = URL.createObjectURL(files)
            $image
                .cropper('destroy') // 销毁旧的裁剪区域
                .attr('src', newImgURL) // 重新设置图片路径
                .cropper(options) // 重新初始化裁剪区域
        })
        //定义文章的发布状态
    var art_state = '已发布'
    $('#btnSave2').on('click', function() {
            art_state = '草稿'
        })
        //为标单注册submit事件
    $('#form-pub').on('submit', function(e) {
        e.preventDefault()
        var fd = new FormData($(this)[0])
        fd.append('state', art_state)
            //将封面裁剪过后的图片输出为一个文件
        $image
            .cropper('getCroppedCanvas', {
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                //5.将文件对象存到数据中
                fd.append('cover_img', blob)
                    // 发起ajax请求
                publishArticle(fd)
            })
    })

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {

                if (res.status !== 0) {
                    return layer.msg('发布文章失败!');
                }
                layer.msg('发布文章成功!');
                window.parent.$('.btn-liebiao').click()
            }
        })
    }

})