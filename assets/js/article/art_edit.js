$(function () {
    let layer = layui.layer;
    let form = layui.form;

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options);

    // 加载文章分类
    initCate();
    // 初始化富文本框
    initEditor();
    // 获取文章详情
    getArticleInfo();


    // 为选择封面按钮，绑定点击事件处理函数
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })

    // 监听coverFile的 change事件，获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        let filelist = e.target.files;
        if (filelist.length === 0) {
            return layer.msg('请选择图片');
        }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(filelist[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 发布---------------------------------------------------------
    // 定义文章的发布状态
    let art_status = '已发布';

    // 为存为草稿按钮，绑定点击事件处理函数
    $('#btnSave2').on('click', function () {
        art_status = '草稿';
    })

    // 为表单绑定submit提交事件
    $('#form-pub').on('submit', function (e) {
        // 1.阻止表单的默认提交行为
        e.preventDefault();
        // 2. 基于form表单，快速创建一个 FormData 对象
        let fd = new FormData($(this)[0]);
        // 3. 将文章的发布状态，存到 fd 中
        fd.append('state', art_status);
        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
                publishArticle(fd);
            })
    })



    // 定义加载文章分类的函数-------------------------------------------------
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！');
                }
                // 调用模板引擎，渲染分类的下拉菜单
                let htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 一定要记得调用 form.render() 方法
                form.render();
            }
        })
    }

    // 定义获取文章详情的方法
    function getArticleInfo() {
        // 根据url地址栏获取到id值
        let id = location.search.substr(1).split('=')[1];
        $.ajax({
            method: 'GET',
            url: '/my/article/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章失败！');
                }
                // 快速为表单赋值
                form.val('formArticleInfo', res.data);
                // 为裁剪区域重新设置图片
                $image
                    .cropper('destroy') // 销毁旧的裁剪区域
                    .attr('src', 'http://api-breakingnews-web.itheima.net' + res.data.cover_img) // 重新设置图片路径
                    .cropper(options) // 重新初始化裁剪区域
            }
        })
    }

    // 定义更新文章的方法------------------------------------------------
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/edit',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！');
                }
                layer.msg(res.message, {
                    time: 2000
                }, function () {
                    location.href = 'art_list.html';
                })
            }
        })
    }
})