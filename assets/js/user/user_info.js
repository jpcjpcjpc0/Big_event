$(function () {
    let form = layui.form;
    var layer = layui.layer;
    form.verify({
        // nickname: function (value) {
        //     if (value.length > 6) {
        //         return '昵称长度必须在 1 ~ 6 个字符之间';
        //     }
        // }
        nickname: [
            /^[\S]{1,6}$/,
            '用户昵称应在1 ~ 6之间'
        ]
    })

    initUserInfo();
    // 初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！');
                }
                // 使用 form.val() 方法为表单快速赋值，需要先给表单指定lay-filter属性
                form.val('formUserInfo', res.data);
            }
        })
    }

    // 重置表单信息
    $('#btnReset').on('click', function (e) {
        // 阻止表单默认重置行为
        e.preventDefault();
        initUserInfo();
    })

    // 监听表单提交事件
    $('.layui-form').on('submit', function (e) {
        // 阻止表单默认提交行为
        e.preventDefault();

        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！');
                }
                layer.msg('更新用户信息成功！', {
                    time: 1000
                }, function () {
                    // 调用父页面中的方法，重新渲染用户的头像和用户的信息
                    window.parent.getUserInfo();
                });
            }
        })
    })
})