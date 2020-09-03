// •Firefox 鼠标滚轮向上滚动是-3，向下滚动是3
// •IE 鼠标滚轮向上滚动是120，向下滚动是-120
// •Safari 鼠标滚轮向上滚动是360，向下滚动是-360
// •Opera 鼠标滚轮向上滚动是120，向下滚动是-120
// •Chrome 鼠标滚轮向上滚动是120，向下滚动是-120
// firefox:event.detail  其余： event.wheelDelta
// init:{
//     el:xxx //只用传入容器dom,会自动创建轨道，滚动条
// }    
// 针对轨道宽度和内容容器高度一致的情况
function v2Scroll(init) {
    var container = init.el,
        containerTop = container.offsetTop,
        containerH = container.offsetHeight;
    var content = container.children[0],
        contentH = content.offsetHeight,
        scale = containerH / contentH;
    if (containerH > contentH) {
        return;
    }
    var bar_container = document.createElement("div");
    bar_container.style.cssText = "width:20px;background:pink;position:absolute;right:0;top:0;height:100%;z-index:0"
    var bar = document.createElement("div");
    bar.style.cssText = "width:20px;background:rgba(0,0,0,.5);position:absolute;top:0;right:0;border-radius:2px;z-index:1;";
    bar.id = "v2-bar";
    container.appendChild(bar);
    container.appendChild(bar_container);
    var barH = Math.floor(scale * containerH);
    bar.style.height = barH + 'px';

    // 拖拽bar事件
    function dragBar() {
        var topY;
        // 鼠标点击事件
        var mousedown = function (e) {
            preventDefault(e);
            topY = e.pageY - bar.offsetTop - containerTop; //鼠标按下时，鼠标位置距离bar顶部的距离
            bindEvent(document, 'mousemove', mousemove);
        }
        // 鼠标移动事件
        var mousemove = function (e) {
            preventDefault(e);
            var moveY;
            moveY = e.pageY - topY - containerTop;
            if (moveY < 0) {
                bar.style.top = 0 + 'px';
            } else if (moveY > (containerH - barH)) {
                bar.style.top = (containerH - barH) + 'px';
            } else {
                bar.style.top = moveY + 'px';
            }
            slideContent();
            bindEvent(document, 'mouseup', mouseup);
        }
        // 鼠标抬起事件
        var mouseup = function (e) {
            preventDefault(e);
            removeEvent(document, 'mousemove', mousemove);
            removeEvent(document, 'mouseup', mouseup);
        }

        bindEvent(bar, 'mousedown', mousedown);
        bindEvent(bar, 'click', mouseup); //防止快速点击bar，导致mousedown事件未触发
    }
    // 点击轨道事件
    function clickBarContainer() {
        var click = function (e) {
            bar.style.transition = "0.3s";
            content.style.transition = "0.3s";
            preventDefault(e);
            var num = 0;
            var spend = 30;
            var clickTop = e.pageY - containerTop;
            if (clickTop > bar.offsetTop + barH) {
                num = bar.offsetTop + spend;
                if (num > containerH - barH) {
                    num = containerH - barH;
                }
                bar.style.top = num + "px";
            } else if (clickTop < bar.offsetTop) {
                num = bar.offsetTop - spend;
                if (num < 0) {
                    num = 0;
                }
                bar.style.top = num + "px";
            }
            var scale2 = num / (containerH - barH); //由于transtion的效果，在300ms之后bar.offsetTop的值才正常，所以不能直接调用slideContent
            content.style.top = scale2 * (containerH - contentH) + 'px';
            setTimeout(function () {
                bar.style.transition = "none";
                content.style.transition = "none";
            }, 300)
        }
        bindEvent(bar_container, 'click', click);
    }
    // 鼠标滚轮事件
    function mouseWheel() {
        var mousewheel = function (e) {
            preventDefault(e);
            var event = e || window.event;
            var direction = event.wheelDelta || -event.detail;
            if (direction > 0) { // 向上滑动
                var moveY = bar.offsetTop - 10;
                if (moveY < 0) {
                    bar.style.top = 0 + 'px';
                } else {
                    bar.style.top = moveY + 'px';
                }
            } else if (direction < 0) {
                var moveY = bar.offsetTop + 10;
                if (moveY > (containerH - barH)) {
                    bar.style.top = (containerH - barH) + 'px';
                } else {
                    bar.style.top = moveY + 'px'
                }
            }
            slideContent();
        }
        // 兼容火狐
        if (typeof container.onmousewheel === 'object') {
            bindEvent(container, 'mousewheel', mousewheel);
        } else {
            bindEvent(container, 'DOMMouseScroll', mousewheel);
        }
    }
    // 内容区滚动事件
    function slideContent() {
        var scale2 = bar.offsetTop / (containerH - barH);
        content.style.top = scale2 * (containerH - contentH) + 'px'; //top为负值，则内容区为向上，滚动条为向下，-（x-y）= y-x
    }
    // 取消默认事件
    function preventDefault(event) {
        var e = event || window.event;
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue();
        }
    }
    // 绑定事件
    function bindEvent(elem, type, handle) {
        if (elem.addEventListener) {
            elem.addEventListener(type, handle, false);
        } else if (elem.attachEvent) {
            elem.attachEvent('on' + type, function () {
                handle.call(elem);
            })
        } else {
            elem['on' + type] = handle;
        }
    }
    // 解除绑定事件
    function removeEvent(elem, type, handle) {
        if (elem.removeEventListener) {
            elem.removeEventListener(type, handle, false);
        } else {
            elem.detach('on' + type, function () {
                handle.call(elem);
            })
        }
    }
    dragBar();
    clickBarContainer();
    mouseWheel();
}