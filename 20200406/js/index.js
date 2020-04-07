let shopModule = (function shopModule() {
    // 获取DOM元素
    let navList = document.querySelectorAll('.navbar-nav .nav-item'),
        productBox = document.querySelector('.productBox'),
        data = null;

    // AJAX获取数据
    let queryData = function queryData() {
        let xhr = new XMLHttpRequest;
        xhr.open('GET', './json/product.json', false);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                data = JSON.parse(xhr.responseText);
            }
        };
        xhr.send(null);
    };

    // 数据渲染
    let render = function render() {
        let str = ``;
        data.forEach(item => {
            let {
                title,
                price,
                time,
                hot,
                img
            } = item;
            str += `<div class="card">
            <img src="img/1.jpg" class="card-img-top" alt="">
            <div class="card-body">
                <h5 class="card-title">${title}</h5>
                <p class="card-text">价格：¥${price.toFixed(2)}</p>
                <p class="card-text">销量：${hot}</p>
                <p class="card-text">时间：${time.replace(/-/g,'/')}</p>
            </div>
            </div>`;
        });
        productBox.innerHTML = str;
    };

    // 操作事件
    let handle = function handle() {
        Array.from(navList).forEach(item => {
            item.flag =-1;
            item.onclick = function () {
                clear.call(this);
                this.flag*=-1;
                let pai = this.getAttribute('data-pai');
                data.sort((a, b) => {
                    a = String(a[pai]).replace(/-/g,'');
                    b = String(b[pai]).replace(/-/g,'');
                    return (a - b)*this.flag;
                });
                render();
            };
        });
    };

    let clear=function clear(){
        Array.from(navList).forEach(item => {
            if(item!==this){
                item.flag=-1;
            }
        });
    };

    return {
        init() {
            queryData();
            render();
            handle();
        }
    };
})();
shopModule.init();