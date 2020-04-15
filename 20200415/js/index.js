let cascadeFlowModule = (function () {

    // 获取要放入卡片的三列框架
    let columns = Array.from(document.querySelectorAll(".column")),
        _data = [];

    // 用AJAX获取数据
    let queryData = function queryData() {
        let xhr = new XMLHttpRequest;
        xhr.open('GET', 'json/data.json', false);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                _data = JSON.parse(xhr.responseText);
            }
        };
        xhr.send(null);
    };

    // 将json中的数据绑定到HTML中
    let bindHTML = function bindHTML() {
        _data.map(item => {
            let w = item.width,
                h = item.height;
            h = (387 * h) / w;
            return item;
        });
        for (let i = 0; i < _data.length; i += 3) {
            let group = _data.slice(i, i + 3);
            group.sort((a, b) => {
                return a.height - b.height;
            });
            columns.sort((a, b) => {
                return b.offsetHeight - a.offsetHeight;
            });
            group.forEach((item, index) => {
                let {
                    pic,
                    height,
                    title,
                    link
                } = item;
                let card = document.createElement('div');
                card.className = "card";
                card.innerHTML = `<a href="${link}">
                    <div class="lazyImageBox" style="height:${height}px"><img src="" alt="" data-img="${pic}"></div>
                    <p>${title}</p>
                </a>`;
                columns[index].appendChild(card);
            });
        }
    };

    // 延迟加载的触发条件
    let lazyFunc = function lazyFunc() {
        let lazyImageBox = document.querySelectorAll('.lazyImageBox');
        [].forEach.call(lazyImageBox, item => {
            let isload = item.getAttribute('isload');
            if (isload === "true") return;
            // A图片位置，B窗口位置
            let A = item.offsetHeight / 2 + utils.offset(item).top,
                B = document.documentElement.clientHeight + document.documentElement.scrollTop;
            if (B >= A) {
                // 触发加载地址及改变透明度
                lazyImg(item);
            }
        });
    };

    // 加载图片
    let lazyImg = function lazyImg(item) {
        let img = item.querySelector('img'),
            dataImg = img.getAttribute('data-img'),
            tempImg = new Image;
        tempImg.src = dataImg;
        tempImg.onload = () => {
            img.src = dataImg;
            utils.css(img, 'opacity', 1)
        };
        // 做一些优化
        img.removeAttribute('data-img');
        tempImg = null;
        // 加载过图片做标记
        item.setAttribute('isload', 'true');
    };

    // 循环加载页面
    let isRender;
    let loadMoreData = function loadMoreData() {
        let HTML = document.documentElement;
        if (HTML.clientHeight * 1.5 + HTML.scrollTop >= HTML.scrollHeight) {
            if (isRender) return;
            isRender = true;
            queryData();
            bindHTML();
            lazyFunc();
            isRender = false;
        }
    };

    return {
        init() {
            queryData();
            bindHTML();
            lazyFunc();
            window.onscroll = () => {
                lazyFunc();
                loadMoreData();
            };
        }
    };
})();
cascadeFlowModule.init();