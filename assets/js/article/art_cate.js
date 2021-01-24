$(function () {
    let layer = layui.layer;
    let form = layui.form;

    // 发起请求，获取文章分类列表数据
    initArtCateList();


    // 添加功能-----------------------------------------------
    // 为添加类别按钮绑定点击事件
    let indexAdd = null;
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            // 将添加分类的弹出层给content
            content: $('#dialog-add').html()
        });
    })

    // 通过代理的形式，为form-add表单绑定submit事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增文章分类失败！');
                }
                layer.msg('新增文章分类成功！', {
                    time: 2000
                }, function () {
                    // 根据索引，关闭对应的弹出层
                    layer.close(indexAdd);

                    initArtCateList();
                });
            }
        })
    })


    // 修改功能-----------------------------------------------
    // 通过代理的形式，为btn-edit按钮绑定点击事件
    let indexEdit = null;
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            // 将添加分类的弹出层给content
            content: $('#dialog-edit').html()
        });

        // 获取id
        let id = $(this).data('id');
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data);
            }
        })
    })

    // 通过代理的形式，为form-edit表单绑定submit事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！');
                }
                layer.msg('更新分类数据成功！', {
                    time: 2000
                }, function () {
                    // 根据索引，关闭对应的弹出层
                    layer.close(indexEdit);

                    initArtCateList();
                });
            }
        })
    })


    // 删除功能-----------------------------------------------
    // 通过代理的形式，为btn-delete按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        let id = $(this).data('id');
        layer.confirm('确认删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！');
                    }
                    layer.msg('删除分类成功！', {
                        time: 2000
                    }, function () {
                        layer.close(index);
                        initArtCateList();
                    });
                }
            })
        });
    })




    // 获取文章分类的列表函数
    function initArtCateList() {
        let layer = layui.layer;
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败！')
                }
                // 实例化模板引擎
                let htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        })
    }
})