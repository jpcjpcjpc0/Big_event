$(function () {
    let layer = layui.layer;
    let form = layui.form;
    // 导入分页方法
    let laypage = layui.laypage;

    // 通过 template.defaults.imports 定义过滤器-------------------------
    template.defaults.imports.dateFormat = function (date) {
        const dt = new Date(date);

        let y = dt.getFullYear();
        let m = padZero(dt.getMonth() + 1);
        let d = padZero(dt.getDate());

        let hh = padZero(dt.getHours());
        let mm = padZero(dt.getMinutes());
        let ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    // 定义补零函数
    function padZero(n) {
        return n < 10 ? '0' + n : n;
    }


    // 定义一个查询参数对象，将来请求数据的时候需要将请求参数对象提交到服务器---------------------------------------------
    let q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }

    // 获取文章列表数据----------------------------------------------------
    initTable();

    // 获取文章分类的下拉选择框数据
    initCate();


    // 为筛选表单绑定 submit 事件----------------------------------------
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取表单中选中项的值
        let cate_id = $('[name=cate_id]').val();
        let state = $('[name=state]').val();
        // 为查询参数对象q中对应的属性赋值
        q.pagenum = 1;
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的筛选条件，重新渲染表格的数据
        initTable();
    })

    // 通过代理，为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function () {
        // 获取删除按钮的个数
        let len = $('.btn-delete').length;
        // 获取到文章的id
        let id = $(this).data('id');
        // 询问用户是否要删除数据
        layer.confirm('确认删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！');
                    }
                    layer.msg('删除文章成功！', {
                        time: 1000
                    }, function () {
                        // 当数据删除完成后，需要判断当前这一页中是否还有剩余数据，如果没有剩余数据了，则让页码值-1，之后，再重新调用initTable()方法
                        if (len === 1) {
                            // 如果len的值等于1，说明删除完毕之后，页面上就没有任何数据了
                            // 页码值最小必须是1
                            q.pagenum === 1 ? q.pagenum = 1 : q.pagenum--;
                        }
                        initTable();
                    })
                }
            })
            layer.close(index);
        });
    })

    // 通过代理，为编辑按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-edit', function () {
        // 获取文章对应的id值，并将id值传入url地址栏
        let id = $(this).data('id');
        location.href = 'art_edit.html?id=' + id;
    })



    // 定义获取文章列表数据的函数---------------------------------------------
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！');
                }
                // 使用模板引擎渲染页面数据
                let htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);

                // 渲染分页
                renderPage(res.total);
            }
        })
    }

    // 定义初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！');
                }
                let htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    }

    // 定义渲染分页的方法，接收一个总数量的参数
    function renderPage(total) {
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', //分页容器的Id
            count: total, //总数据条数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候，触发jump回调
            // 触发jump回调的方式有两种：
            // 1.点击页码的时候，会触发jump回调
            // 2.只要调用了 laypage.render()方法，就会触发jump回调
            jump: function (obj, first) {
                // 把最新的页码值，赋值到q这个查询参数对象中
                q.pagenum = obj.curr;
                // 把最新的条目数，赋值到q这个查询参数对象中
                q.pagesize = obj.limit;

                // 可以通过 first 的值，来判断是通过哪种方式，触发jump回调
                // 如果 first 的值为true，证明是方式2触发的
                // 否则是方式1触发的 first = undefined
                if (!first) {
                    initTable();
                }
            }
        })
    }
})