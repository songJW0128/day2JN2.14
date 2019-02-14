/*
 * @Author: sjw 
 * @Date: 2018-10-25 13:43:39 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-10-26 13:57:17
 */

var mySwiper = new Swiper('.banner', {
    click: true,
    on: {
        slideChange: function() {
            var ind = this.activeIndex;
            $('.footer').find('dl').eq(ind).addClass('active').siblings().removeClass('active');
        }
    }
})

$('.footer').on('click', 'dl', function() {
    var index = $(this).index();
    mySwiper.slideTo(index);
})

var leftScroll = new BScroll('.left', {
    scrollY: true,
    click: true,
})
var rightScroll = new BScroll('.right', {
    scrollY: true,
    click: true,
    probeType: 2,
})



var newdata;
var page = 0;
var pageSize = 10;
init();

function init() {
    $.ajax({
        url: 'data/data.json',
        data: {
            page: page,
            pageSize: pageSize
        },
        success: function(data) {
            if (data.code == 0) {
                newdata = data;
                render(data.result);
                console.log(newdata.result[index].list)
            }
        }
    })
}

function render(data) {
    console.log(data);
    var leftHtml = ``;
    $.each(data, function(i, v) {
        leftHtml += `<li class="">${v.title}</li>`
    })
    $('.listLeft').html(leftHtml);
    $('.listLeft').find('li').eq(0).addClass('active1');
    renderRight(newdata.result[index].list);
}

function renderRight(data) {
    var Righthtml = ``;
    $.each(data, function(i, v) {
        Righthtml += ` <dl>
                        <dt><img src="${v.img}" alt=""></dt>
                        <dd>${v.name}</dd>
                       </dl>`
    })
    $('.listRight').append(Righthtml);
    rightScroll.refresh();
}

var index = 0;
$('.listLeft').on('click', 'li', function() {
    $(this).addClass('active1').siblings().removeClass('active1');
    var inde = $(this).index();
    index = inde;
    $('.listRight').html('');
    renderRight(newdata.result[index].list);
})


rightScroll.on('scroll', function() {
    if (this.y < this.maxScrollY - 50) {
        $('.pullup').html('释放刷新更多....').addClass('flip');
    } else if (this.y > this.maxScrollY - 50) {
        $('.pullup').html('上拉加载').removeClass('flip');
    }
    if (this.y > 50) {
        $('.pulldown').html('释放刷新').addClass('flip');
    } else if (this.y < 50) {
        $('.pulldown').html('上拉刷新').removeClass('flip')
    }
})
rightScroll.on('scrollEnd', function() {
    if ($('.pullup').hasClass('flip')) {
        pullup();
        init();
    } else if ($('.pulldown').hasClass('flip')) {
        page = 1;
        $('.listRight').html('');
        pulldown();
        init();
    }
})

function pulldown() {
    $('.listRight').html('');
    page = 1;
    init();
}

function pullup() {
    init();
    renderRight(newdata.result[index].list);
}