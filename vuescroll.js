/*
 * @name: vuescroll 2.7.7
 * @author: wangyi
 * @description: A virtual scrollbar based on vue.js 2.x inspired by slimscroll
 * @license: MIT
 * @GitHub: https://github.com/wangyi7099/vuescroll
 */
(function(global, factory) {
    typeof define === 'function' && define.amd ? define(factory) : typeof module !== 'undefined' ? module.exports = factory() : (global.Vue.use(factory()));
}
)(this, function() {

    // registry the plugin
    var scroll = {
        install: function(Vue) {
            Vue.component(vRail.name, vRail);
            Vue.component(vScrollbar.name, vScrollbar);
            Vue.component(hRail.name, hRail);
            Vue.component(hScrollbar.name, hScrollbar);
            Vue.component(vueScrollPanel.name, vueScrollPanel);
            //vueScroll
            Vue.component(vueScroll.name, vueScroll);
        }
    };

    /**
     * @description return the computed value of a dom
     * @author wangyi7099
     * @param {any} dom 
     * @param {any} property 
     */
    function getComputed(dom, property) {
        return window.getComputedStyle(dom).getPropertyValue(property);
    }

    //scrollpanne
    var vueScrollPanel = {
        name: 'vueScrollPanel',
        render: function(_c) {
            var vm = this;
            var style = vm.scrollContentStyle;
            style.overflow = 'hidden';
            return _c('div', {
                style: style,
                class: "vueScrollPanel"
            }, this.$slots.default);
        },
        props: {
            scrollContentStyle: {
            }
        }
    }

    // vertical rail
    var vRail = {
        name: 'vRail',
        render: function(_c) {
            var vm = this;
            var style = {
                position: 'absolute',
                top: 0,
                height: '100%',
                width: vm.ops.width,
                opacity: 1
            };
            // determine the position
            if (vm.ops.pos == 'right') {
                style['right'] = 0;
            } else {
                style['left'] = 0;
            }

            return _c('div', {
                style: style,
                on: {
                    "click": function(e) {
                        console.log(e);
                    }
                }
            }, this.$slots.default);
        },
        props: {
            ops: {
                width: {
                    default: '5px'
                },
                pos: {
                    default: 'left'
                }
            }
        }
    }

    // vertical scrollBar
    var vScrollbar = {
        name: 'vScrollbar',
        computed: {
            computedTop() {
                return this.state.top * 100;
            }
        },
        render: function(_c) {
            var vm = this;
            var style = {
                position: 'relative',
                height: vm.state.height + 'px',
                width: '100%',
                background: vm.ops.background,
                transform: "translateY(" + vm.computedTop + "%)",
                transition: 'opacity .5s',
                cursor: 'pointer',
                opacity: vm.state.opacity,
                userSelect: 'none'
            }
            return _c('div', {
                style: style,
                class: "vScrollbar"
            });
        },
        props: {
            ops: {
                default: {
                    background: 'hsla(220,4%,58%,.3)',
                    opacity: 0,
                    pos: 'left'
                }
            },
            state: {
                default: {
                    top: {
                        default: 0
                    },
                    height: {
                        default: 0
                    },
                    opacity: {
                        default: 0
                    }
                }
            }
        }
    }

    // horizontal rail
    var hRail = {
        name: 'hRail',
        render: function(_c) {
            var vm = this;
            var style = {
                position: 'absolute',
                left:0,
                width: '100%',
                height: vm.ops.height,
                opacity: 1
            };
            // determine the position
            if (vm.ops.pos == 'top') {
                style['top'] = 0;
            } else {
                style['bottom'] = 0;
            }

            return _c('div', {
                style: style,
                on: {
                    "click": function(e) {
                        console.log(e);
                    }
                }
            }, this.$slots.default);
        },
        props: {
            ops: {
                height: {
                    default: '5px'
                },
                pos: {
                    default: 'bottom'
                }
            }
        }
    }

    // horizontal scrollBar
    var hScrollbar = {
        name: 'hScrollbar',
        computed: {
            computedLeft() {
                return this.state.left * 100;
            }
        },
        render: function(_c) {
            var vm = this;
            var style = {
                position: 'relative',
                width: vm.state.width + 'px',
                height: '100%',
                background: vm.ops.background,
                transform: "translateX(" + vm.computedLeft + "%)",
                transition: 'opacity .5s',
                cursor: 'pointer',
                opacity: vm.state.opacity,
                userSelect: 'none'
            }
            return _c('div', {
                style: style,
                class: "hScrollbar"
            });
        },
        props: {
            ops: {
                default: {
                    background: 'hsla(220,4%,58%,.3)',
                    opacity: 0,
                    pos: 'bottom'
                }
            },
            state: {
                default: {
                    left: {
                        default: 0
                    },
                    width: {
                        default: 0
                    },
                    opacity: {
                        default: 0
                    }
                }
            }
        }
    }
    var vueScroll = {
        name: "vueScroll",
        data() {
            return {
                scrollPanel: {
                    el: "",
                    ops: {}
                },
                vRail: {
                    ops: {
                        width: '5px',
                        pos: ''
                    }
                },
                vScrollbar: {
                    el: "",
                    ops: {
                        background: 'hsla(220,4%,58%,.3)',
                        deltaY: 30,
                        keepShow: false,
                        opacity: 1
                    },
                    state: {
                        top: 0,
                        height: 0,
                        opacity: 0
                    },
                    minBarHeight: 35,
                    innerDeltaY: 0
                },
                hRail: {
                    ops: {
                        height: '5px',
                        pos: ''
                    }
                },
                hScrollbar: {
                    el: "",
                    ops: {
                        background: 'hsla(220,4%,58%,.3)',
                        deltaX: 30,
                        keepShow: false,
                        opacity: 1
                    },
                    state: {
                        left: 0,
                        width: 0,
                        opacity: 0
                    },
                    minBarWidth: 35,
                    innerDeltaX: 0
                },
                listeners: [],
                mousedown: false,
                isMouseLeavePanel: true
            }
        },
        render: function(_c) {
            var vm = this;
            return _c('div', {
                class: 'vueScroll',
                style: {
                    position: 'relative',
                    height: '100%',
                    width: '100%'
                },
                on: {
                    wheel: vm.wheel,
                    mouseenter: function() {
                        vm.isMouseLeavePanel = false;
                        vm.showBar();
                    },
                    mouseleave: function() {
                        vm.isMouseLeavePanel = true;
                        vm.hideBar();
                    },
                    mousemove: function() {
                        vm.isMouseLeavePanel = false;
                        vm.showBar();
                    }
                },
            }, [_c('vueScrollPanel', {
                ref: 'vueScrollPanel',
                props: {
                    scrollContentStyle: vm.scrollContentStyle
                }
            }, vm.$slots.default), _c('vRail', {
                props: {
                    ops: vm.vRail.ops
                }
            }, [_c("vScrollbar", {
                props: {
                    ops: vm.vScrollbar.ops,
                    state: vm.vScrollbar.state
                },
                ref: "vScrollbar"
            })]), _c('hRail', {
                props: {
                    ops: vm.hRail.ops
                }
            }, [_c('hScrollbar', {
                props: {
                    ops: vm.hScrollbar.ops,
                    state: vm.hScrollbar.state
                },
                ref: "hScrollbar"
            })])]);
        },
        mounted() {
            this.initEl();
            this.mergeAll();
            this.initBarDrag();
            this.listenPanelTouch();
            // showbar at init time
            this.showBar();
        },
        methods: {
            initEl() {
                this.scrollPanel.el = this.$refs['vueScrollPanel'] && this.$refs['vueScrollPanel'].$el;
                this.vScrollbar.el = this.$refs['vScrollbar'] && this.$refs['vScrollbar'].$el;
                this.hScrollbar.el = this.$refs['hScrollbar'] && this.$refs['hScrollbar'].$el;
            },
            mergeAll() {
                this.merge(this.ops.vBar, this.vScrollbar.ops);
                this.merge(this.ops.hBar, this.hScrollbar.ops);
                this.merge(this.ops.vBar, this.vRail.ops);
                this.merge(this.ops.hBar, this.hRail.ops);
                this.merge(this.scrollContentStyle, this.scrollPanel.ops);
            },
            merge(from, to, check) {
                for (key in from) {
                    if (check === false) {
                        this.$set(to, key, from[key]);
                    } else if (Object.hasOwnProperty.call(to, key)) {
                        this.$set(to, key, from[key]);
                    }
                }
            },
            initBarDrag() {
                var vScrollbar = this.listenBarDrag('vScrollbar'); 
                var hScrollbar = this.listenBarDrag('hScrollbar');
                vScrollbar();
                hScrollbar();
            },
            // get the bar height or width
            getBarPropertyValue(type, scrollPanelPropertyValue, scrollPanelScrollPropertyValue) {
                var property = type === 'vScrollbar'?'Height':'Width';
                // choose the proper height for scrollbar
                var propertyValue = scrollPanelPropertyValue/(scrollPanelScrollPropertyValue/scrollPanelPropertyValue);
                var value = Math.max(propertyValue, this[type]['minBar' + property]);
                if ((scrollPanelScrollPropertyValue <= scrollPanelPropertyValue) || Math.abs(scrollPanelPropertyValue - scrollPanelScrollPropertyValue) <= this.accuracy) {
                    value = 0;
                }

                return value;
            },
            // adjust a bar's position
            adjustBarPos(scrollPropertyValue, scrollPanelPropertyValue, scrollDirectionValue, scrollPanelScrollValue) {
                var percent = (scrollDirectionValue)/ (scrollPanelScrollValue - scrollPanelPropertyValue);
                var percentToPx = (scrollPanelPropertyValue - scrollPropertyValue) * percent;
                return parseFloat(percentToPx / scrollPropertyValue).toFixed(4);
            },
            // show All bar
            showBar() {
                this.showVBar();
                this.showHBar();
            },
            // hide all bar
            hideBar() {
                this.hideVBar();
                this.hideHBar();
            },
            // showVbar
            showVBar() {
                if (!this.isMouseLeavePanel || this.vScrollbar.ops.keepShow) {
                    var scrollPanelPropertyValue = Math.floor(getComputed(this.scrollPanel.el, 'height').replace('px', ""));
                    var scrollPanelScrollPropertyValue = Math.floor(this.scrollPanel.el['scrollHeight']);
                    var scrollDirectionValue = Math.floor(this.scrollPanel.el['scrollTop']);
                    if ((this.vScrollbar.state.height = this.getBarPropertyValue('vScrollbar', scrollPanelPropertyValue, scrollPanelScrollPropertyValue))) {
                        this.vScrollbar.state.top = 
                        this.adjustBarPos(
                            this.vScrollbar.state.height, 
                            scrollPanelPropertyValue, 
                            scrollDirectionValue,
                            scrollPanelScrollPropertyValue
                        );
                        this.vScrollbar.state.opacity = this.vScrollbar.ops.opacity;
                    }
                }
            },
            // showHbar
            showHBar() {
                if (!this.isMouseLeavePanel || this.vScrollbar.ops.keepShow) {
                    var scrollPanelPropertyValue = Math.floor(getComputed(this.scrollPanel.el, 'width').replace('px', ""));
                    var scrollPanelScrollPropertyValue = Math.floor(this.scrollPanel.el['scrollWidth']);
                    var scrollDirectionValue = Math.floor(this.scrollPanel.el['scrollLeft']);
                    if ((this.hScrollbar.state.width = this.getBarPropertyValue('hScrollbar', scrollPanelPropertyValue, scrollPanelScrollPropertyValue))) {
                        this.hScrollbar.state.left = 
                        this.adjustBarPos(
                            this.vScrollbar.state.width, 
                            scrollPanelPropertyValue, 
                            scrollDirectionValue,
                            scrollPanelScrollPropertyValue
                        );
                        this.hScrollbar.state.opacity = this.hScrollbar.ops.opacity;
                    }
                }
            },
            // hideVbar
            hideVBar() {
                if (!this.vScrollbar.ops.keepShow) {
                    if (!this.mousedown && this.isMouseLeavePanel) {
                        this.vScrollbar.state.opacity = 0;
                    }
                }
            },
            // hideHbar
            hideHBar() {
                if (!this.hScrollbar.ops.keepShow) {
                    if (!this.mousedown && this.isMouseLeavePanel) {
                        this.hScrollbar.state.opacity = 0;
                    }
                }
            },
            // listen wheel scrolling
            wheel(e) {
                var vm = this;
                var pos = e.deltaY > 0 ? 1 : -1;
                vm.showVBar();
                vm.scrollBar(pos * this.vScrollbar.ops.deltaY, 'vScrollbar');
                e.stopPropagation();
            },
            scrollBar: function(distance, type) {
                // >0 scroll to down or right  <0 scroll to up or left
                var direction = type == 'vScrollbar' ? 'top' : 'left';
                var upperCaseDirection = type == 'vScrollbar' ? 'Top' : 'Left';
                var property = type == 'vScrollbar' ? 'height' : 'width';
                var upperCaseProperty = type == 'vScrollbar' ? 'Height' : 'Width';
                var event = type == 'vScrollbar' ? 'vscroll' : 'hscroll';
                var directionValue = this[type].state[direction];
                var scrollPanelPropertyValue = getComputed(this.scrollPanel.el, property).replace('px', "");
                var scrollPanelScrollValue = this.scrollPanel.el['scroll' + upperCaseProperty];
                var scrollDirectionValue = this.scrollPanel.el['scroll' + upperCaseDirection];
                var propertyValue = this[type].state[property];
                    var ScrollDirectionValue = scrollDirectionValue + distance;
                    if (distance < 0) {
                        // scroll up or left
                        this.scrollPanel.el['scroll' + upperCaseDirection] = Math.max(0, ScrollDirectionValue + distance);
                    } else if (distance > 0) {
                        // scroll down or right
                        this.scrollPanel.el['scroll' + upperCaseDirection] = Math.min(scrollPanelScrollValue - scrollPanelPropertyValue, scrollDirectionValue + distance);
                    }
                    this[type].state[direction] = 
                    this.adjustBarPos(
                        propertyValue, 
                        scrollPanelPropertyValue,
                        scrollDirectionValue,
                        scrollPanelScrollValue
                    );
                var content = {};
                var bar = {};
                var process = "";
                content.residual = (scrollPanelScrollValue - scrollDirectionValue - scrollPanelPropertyValue);
                content.scrolled = scrollDirectionValue;
                bar.scrolled = this[type].state[direction];
                bar.residual = (scrollPanelPropertyValue - this[type].state[direction] - this[type].state[property]);
                bar[property] = this[type].state[property];
                process = bar.scrolled / (scrollPanelPropertyValue - bar[property]);
                bar.name = type;
                content.name = "content";
                this.$emit(event, bar, content, process);
            },
            listenBarDrag: function(type) {
                var vm = this;
                var coordinate = type === 'vScrollbar' ? 'pageY' : 'pageX';
                var bar = type === 'vScrollbar' ? 'VBar' : 'HBar';
                var scrollProperty = type === 'vScrollbar' ? 'scrollHeight' : 'scrollWidth';
                var property = type === 'vScrollbar' ? 'height' : 'width';
                return function() {
                    var pre;
                    var now;
                    function move(e) {
                        now = e[coordinate];
                        var delta = now - pre;
                        var scrollPanelScrollPropertyValue = vm.scrollPanel.el[scrollProperty];
                        var scrollPanelPropertyValue = getComputed(vm.scrollPanel.el, property).replace('px', "");
                        var percent = delta / scrollPanelPropertyValue;
                        vm.scrollBar(scrollPanelScrollPropertyValue * percent, type);
                        pre = now;
                    }
                    function t(e) {
                        vm.mousedown = true;
                        pre = e[coordinate];
                        vm['show' + bar]();
                        document.addEventListener('mousemove', move);
                        document.addEventListener('mouseup', function(e) {
                            vm.mousedown = false;
                            vm['hide' + bar]();
                            document.removeEventListener('mousemove', move);
                        });
                    }
                    vm.listeners.push({
                        dom: vm[type].el,
                        event: t,
                        type: "mousedown"
                    });
                    vm[type].el.addEventListener('mousedown', t);
                }
            },
            listenPanelTouch: function() {
                var vm = this;
                var pannel = this.scrollPanel.el;
                var x, y;
                var _x, _y;
                function move(e) {
                    if (e.touches.length) {
                        var touch = e.touches[0];
                        _x = touch.pageX;
                        _y = touch.pageY;
                        var _delta = void 0;
                        var _deltaX = _x - x;
                        var _deltaY = _y - y;
                        if (Math.abs(_deltaX) > Math.abs(_deltaY)) {
                            _delta = _deltaX;
                            vm.scrollHBar(_delta, 'hScrollbar');
                        } else if (Math.abs(_deltaX) < Math.abs(_deltaY)) {
                            _delta = _deltaY;
                            vm.scrollHBar(_delta, 'vScrollbar');
                        }
                        x = _x;
                        y = _y;
                    }
                }
                function t(e) {

                    if (e.touches.length) {
                        e.stopPropagation();
                        var touch = e.touches[0];
                        vm.mousedown = true;
                        x = touch.pageX;
                        y = touch.pageY;
                        vm.showBar();
                        pannel.addEventListener('touchmove', move);
                        pannel.addEventListener('touchend', function(e) {
                            vm.mousedown = false;
                            vm.hideBar();
                            pannel.removeEventListener('touchmove', move);
                        });
                    }
                }
                pannel.addEventListener('touchstart', t);
                vm.listeners.push({
                    dom: pannel,
                    event: t,
                    type: "touchstart"
                });
            }
        },
        beforeDestroy: function() {
            // remove the registryed event.
            this.listeners.forEach(function(item) {
                item.dom.removeEventListener(item.type, item.event);
            });
        },
        props: {
            ops: {
                default: function() {
                    return {
                        vBar: {
                        },
                        hBar: {
                        }
                    }
                }
            },
            scrollContentStyle: {
                default: function() {
                    return {
                        width: '100%',
                        height: '100%'
                    }
                }
            },
            accuracy: {
                default: 5
            }
        }
    }

    return scroll;
});