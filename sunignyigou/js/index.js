// utils
let utils = (function () {
    function offset(element) {
        let parent = element.offsetParent,
            top = element.offsetTop,
            left = element.offsetLeft;
        while (parent) {
            left += parent.clientLeft;
            top += parent.clientTop;
            left + parent.offsetLeft;
            top += parent.offsetTop;
            parent = parent.offsetParent;
        };
        return {
            top,
            left
        };
    };

    return {
        offset
    }
})();

// 顶部广告
(function topActiveModule() {
    let topActive = document.querySelector('.top-active'),
        topAcWrapper = topActive.querySelector('.top-active_wrap'),
        topAcBin = topActive.querySelector('.top-active_bin'),
        step = 0;


    topAcBin.onclick = function () {
        if (step === 0) {
            topAcWrapper.style.display = 'none';
            topAcBin.style.background = `url(../img/sprites1.png) no-repeat -256px -160px`;
            step = 1;
        } else {
            topAcWrapper.style.display = 'block';
            topAcBin.style.background = `url(../img/sprites1.png) no-repeat -256px -145px`;
            step = 0;
        }
    };

    topAcBin.onmouseleave = function () {
        if (step === 1) {
            topAcBin.style.background = `url(../img/sprites1.png) no-repeat -241px -160px`;
        } else {
            topAcBin.style.background = `url(../img/sprites1.png) no-repeat -241px -145px`;
        }
    };

    topAcBin.onmouseenter = function () {
        if (step === 1) {
            topAcBin.style.background = `url(../img/sprites1.png) no-repeat -256px -160px`;
        } else {
            topAcBin.style.background = `url(../img/sprites1.png) no-repeat -256px -145px`;
        }
    };
})();

// 轮播图-主要部分
(function rotationChartModule() {
    let bannerWrapper = document.querySelector('.banner-wrapper'),
        slideList = bannerWrapper.querySelectorAll('.banner li'),
        navList = bannerWrapper.querySelectorAll('.banner-nav li'),
        btnLeft = bannerWrapper.querySelector('.btn-left'),
        btnRight = bannerWrapper.querySelector('.btn-right');
    let step = 0,
        prev = 0,
        interval = 3000,
        autoTimer = null,
        len = slideList.length;

    function autoMove() {
        prev = step;
        step++;
        step > (len - 1) ? step = 0 : null;
        change();
    }

    function change() {
        let cur = slideList[step],
            pre = slideList[prev];
        cur.style.zIndex = 1;
        pre.style.zIndex = 0;

        cur.style.transitionDuration = '.6s';
        cur.style.opacity = 1;
        setTimeout(() => {
            pre.style.transitionDuration = '0s';
            pre.style.opacity = 0;
        }, 600);

        Array.from(navList).forEach((item, index) => {
            if (index === step) {
                item.className = 'active';
                return;
            }
            item.className = '';
        });
    }

    autoTimer = setInterval(autoMove, interval);

    bannerWrapper.onmouseenter = function () {
        clearInterval(autoTimer);
    };
    bannerWrapper.onmouseleave = function () {
        autoTimer = setInterval(autoMove, interval);
    };

    [].forEach.call(navList, (item, index) => {
        item.onmouseenter = function () {
            if (index === step) {
                return;
            }
            prev = step;
            step = index;
            change();
        };
    });

    btnRight.onclick = autoMove;
    btnLeft.onclick = function () {
        prev = step;
        step--;
        step < 0 ? step = len - 1 : null;
        change();
    };
})();

// 轮播图-右边部分
(function chartRightModule() {
    let leadNews = document.querySelector('.lead-news'),
        leader = leadNews.querySelector('ul');
    let step = 0,
        autoTimer = null,
        interval = 4000;

    function autoMove() {
        step -= 144;

        if (step < -300) {
            step = 0;
            leader.style.marginTop = step + 'px';
            leader.style.transitionDuration = '0s';
            leadNews.offsetWidth;
            step -= 144;
        }
        leader.style.marginTop = step + 'px';
        leader.style.transitionDuration = '3s';
    };

    autoTimer = setInterval(autoMove, interval);

    leadNews.onmouseenter = function () {
        clearInterval(autoTimer);
    };
    leadNews.onmouseleave = function () {
        autoTimer = setInterval(autoMove, interval);
    };

})();

// 延迟加载及左侧边栏滚动部分
let cardFlowModule = (function () {
    let ul = document.querySelector('.reco-floor .reco-content ul'),
        _data = [];

    let queryData = function queryData() {
        let xhr = new XMLHttpRequest;
        xhr.open('GET', 'js/data.json',false);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                _data = JSON.parse(xhr.responseText);
            }
        };
        xhr.send(null);
        // console.log(_data) 
    };

    let bindHTML = function bindHTML() {
        _data.forEach((item, index) => {
            let {
                pic,
                title,
                price,
                cuxiao1,
                cuxiao2,
                cuxiao3
            } = item;
            cuxiao1 = cuxiao1 !== '' ? `<span>${cuxiao1}</span>` : '';
            cuxiao2 = cuxiao2 !== '' ? `<span>${cuxiao1}</span>` : '';
            cuxiao3 = cuxiao3 !== '' ? `<span>${cuxiao1}</span>` : '';
            let li = document.createElement('li');
            li.innerHTML = `<a href="javascript:;" title="${title}">
            <div class="lazyImg">
                <img src="" data-image="${pic}">
            </div>
            <p class="title">
                <i></i>
                ${title}
            </p>
            <p class="price">
                <i>¥</i>
                ${price}
            </p>
            <p class="cxIcon">
                ${cuxiao1}
                ${cuxiao2}
                ${cuxiao3}
            </p>
        </a>
        <div class="label-wp">
            <a href="javascript:;">找相似</a>
        </div>`;
            ul.appendChild(li);
        });
    };

    let lazyFunc = function lazyFunc() {
        let lazyImgList = document.querySelectorAll('.lazyImg');
        [].forEach.call(lazyImgList, item => {
            let isLoad = item.getAttribute('isLoad');
            if (isLoad === 'true') return;
            let B = utils.offset(item).top + item.offsetHeight / 2;
            let A = document.documentElement.clientHeight + document.documentElement.scrollTop;
            if (B <= A) {
                lazyImg(item);
            }
        });
    };
    let lazyImg = function lazyImg(item) {
        let img = item.querySelector('img'),
            dataImage = img.getAttribute('data-image'),
            tempImage = new Image;
        tempImage.src = dataImage;
        tempImage.onload = () => {
            img.src = dataImage;
            img.style.opacity = 1;
        };
        img.removeAttribute('data-image');
        tempImage = null;
        item.setAttribute('isLoad', 'true');
    }

    // 左侧边栏滚动部分
    let floorList = document.querySelectorAll('.floor'),
        floatbar = document.querySelector('.floatbar'),
        floatbarList = floatbar.querySelectorAll('ul li'),
        ismoving = true;

    let scrollFloor = function scrollFloor() {
        [].forEach.call(floorList, (item, index) => {
            let B = utils.offset(item).top + (item.offsetHeight - 150),
                A = document.documentElement.clientHeight + document.documentElement.scrollTop,
                C = utils.offset(item).top,
                D = document.documentElement.scrollTop,
                E = item.offsetHeight;
            if (E > 600 && C + 400 <= A) {
                floatbarList[index].className = 'active';
            } else {
                if (B <= A) {
                    floatbarList[index].className = 'active';
                    F = true;
                } else {
                    floatbarList.className = '';
                }
                if (C < D || A < B) {
                    F = false;
                    floatbarList[index].className = '';
                } else {
                    floatbarList.className = '';
                }
            }
        });
    };
    let displayBar = function displayBar() {
        let A = document.documentElement.scrollTop;
        if (A <= 0 || A >= 13464) {
            floatbar.style.display = 'none';
        } else {
            floatbar.style.display = 'block';
        }
    };
    let mouseBar = function mouseBar() {
        Array.from(floatbarList, (item, index) => {
            item.onmouseenter = function () {
                this.className = 'hover';
                ismoving = false;
            }
            item.onmouseleave = function () {
                this.className = '';
                ismoving = true;
            }
            item.onclick = function () {
                if (this.isGoing) return;
                this.isGoing = true;
                let A = utils.offset(floorList[index]).top,
                    B = document.documentElement.scrollTop;
                let step = (B - A) / 10;
                let timer = setInterval(() => {
                    B = B - step;
                    if (step > 0 && B < A || step < 0 && B >= A) {
                        B = A;
                        clearInterval(timer);
                        this.isGoing = false;
                    }
                    document.documentElement.scrollTop = B;
                }, 100);
            }
        })
    }


    return {
        init() {
            queryData();
            bindHTML();
            lazyFunc();
            mouseBar();
            window.onscroll = function () {
                lazyFunc();
                if (ismoving) {
                    scrollFloor();
                } else {
                    floatbarList.className = '';
                }
                displayBar();
            }
        }
    }

})();
cardFlowModule.init();

// 回到顶部
(function toTop() {
    let toTop = document.querySelector('.sidebar-bottom-to-top');
    toTop.onclick = function () {
        if (this.isGoing) return;
        this.isGoing = true;
        let winTop = document.documentElement.scrollTop;
        let step = winTop / 10;
        let timer = setInterval(() => {
            winTop -= step;
            if (winTop < 0) {
                winTop = 0;
                clearInterval(timer);
                this.isGoing = false;
            }
            document.documentElement.scrollTop = winTop;
        }, 100);
    };
})();

// 一层-倒计时抢购
(function timeOver() {
    let timeBox = document.querySelector('.first-floor .dj-title .time');

    function getServerTime() {
        return new Promise(resolve => {
            let xhr = new XMLHttpRequest;
            xhr.open('head', './data.json?_=' + Math.random());
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 2 && /^(2|3)\d{2}$/.test(xhr.status)) {
                    let time = xhr.getResponseHeader('date');
                    time = new Date(time);
                    resolve(time);
                }
            };
            xhr.send(null);
        })
    }

    function computed(time) {
        let target = new Date('2020/06/01 00:00:00'),
            spanTime = target - time;
        if (spanTime <= 0) {
            timeBox.innerHTML = "抢购时间已到";
            clearInterval(timer);
            return;
        }

        let hours = Math.floor(spanTime / (60 * 60 * 1000));
        spanTime = spanTime - hours * 60 * 60 * 1000;
        let minutes = Math.floor(spanTime / (60 * 1000));
        spanTime = spanTime - minutes * 60 * 1000;
        let seconds = Math.floor(spanTime / 1000);
        hours < 10 ? hours = '0' + hours : null;
        minutes < 10 ? minutes = '0' + minutes : null;
        seconds < 10 ? seconds = '0' + seconds : null;
        timeBox.innerHTML = `<span>${hours}</span>
                <i>:</i>
                <span>${minutes}</span>
                <i>:</i>
            <span>${seconds}</span>`;
    }

    getServerTime().then(time => {
        computed(time);

        timer = setInterval(() => {
            time = new Date(time.getTime() + 1000);
            computed(time);
        }, 1000);
    });
})();