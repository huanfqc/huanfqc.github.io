

$(function(){
    //判断用户是否按下回车键
    load();//调用下面已经封装的'渲染加载数据-封装'。作用是每次刷新网页会把数据先渲染出来
    $('#title').on('keydown',function(e){//判断按键需要用到事件对象
        if(e.keyCode === 13){//回车键的ASCII码值为13
            if($(this).val() === ''){
                alert('请输入内容哦');
            } else{
            //先读取本地存储原来的数据。以后会经常用这个读取功能,可以封装起来
            var local = getDate();
            //把local数组进行更新数据,把最新的数据追加给local数组
            local.push({title: $(this).val(),done:false});
            // 把追加好的数组存储到本地存储,防止刷新页面后失效。以后会经常用这个存储功能,可以封装起来
            saveDate(local);//local是实参,传给封装函数。封装函数里的data形参负责接收
        
            // 把本地存储数据渲染加载到页面。以后会经常用这个存储功能,可以封装起来
            load();

            //清除一下输入框
            $(this).val('');
            }
        }
    });

    // 删除操作
    $('ol,a').on('click','a',function(){ //事件委托或叫事件委派
        //获取本地存储的数据
        var data = getDate();
        //修改数据
        //(1)获取自定义属性
        var index = $(this).attr('id');
        //(2)先删除data对应的数据,还要把这步操作保存到本地存储,还要再渲染一次页面
        data.splice(index,1);
        saveDate(data); //data是删除之后的数据,把data放入本地存储.即这里就完成了本地存储的更新操作
        //(3)重新渲染页面
        load();
    })

    //正在进行、已完成选项操作
    $('ol,ul').on('click','input',function(){//事件委托或叫事件委派
        //先获取本地存储的数据
        var data = getDate(); //注意data获取到的是数组,所以data就是数组
        //修改数据
        //(1)因为input跟a是兄弟,所以可以拿兄弟a的自定义属性,即索引号
        var index = $(this).siblings('a').attr('id');
        //(2)把当前复选框的done属性修改为复选框的选中状态。prop()是获取固有属性。attr()是获取自定义属性
        //还有把这步操作保存到本地存储
        data[index].done = $(this).prop('checked');
        saveDate(data); //保存到本地存储
        //(3)重新渲染页面,在此之前,要在'渲染加载数据-封装'里面加一个操作
        load();
        
    })

    //读取本地存储的数据-封装
    function getDate(){
        var data = localStorage.getItem('todolist');
        if(data !== null){//如果本地存储有这个数据
            //因为本地存储里面的数据是字符串格式,所以要转为对象格式
            return JSON.parse(data);//先转换再返回
        } else{//如果本地存储没有这个数据
            return [];//返回空数组对象
        }
    }

    //保存本地存储数据-封装
    function saveDate(data){
        localStorage.setItem('todolist',JSON.stringify(data));//把data转化为字符串
    }

    //渲染加载数据-封装
    function load(){
        //读取本地存储数据,直接调用上面写好好封装函数
        var data = getDate();
        //遍历之前先要清空ol里面的元素内容
        $('ol,ul').empty();

        var todoCount = 0;//这行是'统计正在进行个数和已经完成个数'的正在进行个数的代码
        var doneCount = 0;//这行是'统计正在进行个数和已经完成个数'的已经完成个数的代码

        //遍历这个数据,log打印下面的n可以输出用户输入的全部数据
        $.each(data,function(i,n){//data:要遍历的数据即data是全部数据 i:索引号 n:从data里具体的数据
            if(n.done){//'正在进行、已完成选项操作'
                //创建元素、追加元素进页面
                //生成的数据追加到ol里面,prepend:新数据每次都从顶部开始追加
                $("ul").prepend("<li><input type='checkbox' checked='checked'> <p>"+n.title+"</p> <a href='javascript:;' id="+i+"></a></li>");
                doneCount++;//统计已经完成个数
            } else{
                $("ol").prepend("<li><input type='checkbox'> <p>"+n.title+"</p> <a href='javascript:;' id="+i+"></a></li>");
                todoCount++;//统计正在进行个数
            }
        });
        //统计个数,写入页面
        $('#todocount').text(todoCount); //修改'正在进行'的那个span的text
        $('#donecount').text(doneCount); //修改'已经完成'的那个span的text
    }
})