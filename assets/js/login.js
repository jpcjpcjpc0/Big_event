$(function () {
    // 点击去注册账号链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    })

    // 点击去登录链接
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    })


    // 从 layui 中获取 form 对象
    let form = layui.form;
    let layer = layui.layer;
    // 通过 form.verify() 函数自定义校验规则
    form.verify({
        // 自定义了一个叫做 pwd 的密码校验规则
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 自定义了一个叫做 user 的用户名校验规则
        user: [
            /^[a-zA-Z0-9_-]{4,16}$/, '用户名必须4到16位(字母，数字，下划线，减号)'
        ],
        // 校验两次密码是否一致
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容然后进行等于的判断
            // 如果判断失败，return一个提示消息即可
            let pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致！';
            }
        }

    })

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        // 1.阻止默认提交行为
        e.preventDefault();
        // 2.发起Ajax请求
        let data = $(this).serialize();
        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message, {
                    time: 2000
                })
            }
            layer.msg('注册成功，请登录！', {
                // 提示框的持续时间设置为2s
                time: 2000
            }, function () {
                // 注册成功执行 去登陆的自执行事件
                $('#link_login').click();
            });
        })
    })

    // 监听登录表单的提交事件
    $('#form_login').on('submit', function (e) {
        // 阻止默认提交行为
        e.preventDefault();
        // 发起ajax请求
        let data = $(this).serialize();
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: data,
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message, {
                        time: 2000
                    });
                }
                layer.msg(res.message, {
                    time: 2000
                }, function () {
                    // 将获取到的 token 字符串，保存到 localStorage 中
                    localStorage.setItem('token', res.token);
                    // 跳转到后台主页
                    location.href = 'index.html';
                });
            }
        })
    })
})