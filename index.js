;
(function ($, window, document, undefined) {
  let Box = function (ele, opt) {
    this.$element = ele;
    this.someBoxActive = false;
    this.defaults = {
      type: null,
    };
    this.options = $.extend({}, this.defaults, opt);
  }
  Box.prototype = {
    createBox() {
      let $drag = $('<div class="drag"></div>');
      if (this.options.type === 'text') {
        $drag.append(_ => {
          return `<div class="text-area" contenteditable="true" data-placeholder="文本"></div>`;
        });
      }
      this.$element.append($drag);
      return $drag;
    },
    drag($ele) {
      $ele.draggable({
        // 约束在指定元素或区域的边界内拖拽
        containment: this.$element,
        // 元素是否对齐到其他元素
        snap: `.drag, .${this.$element.attr('class')}`,
        // 光标
        cursor: 'move',
      });
    },
    active($ele,e) {
      console.log($(e.target))
      e.stopPropagation();
      if ($ele.hasClass('editable')) {
        return;
      } else {
        if ($ele.hasClass('active')) {
          console.log('focus-deep');
          $ele.draggable('destroy').addClass('editable').find('.text-area').focus().css('cursor', 'text');
        } else {
          console.log('focus');
          $ele.addClass('active ants');
          this.resize($ele);
          this.someBoxActive = true;
          $('.tool').show();
        }
      }
    },
    // editable() {

    // },
    blur(e) {
      // console.log(223,!this.someBoxActive,$(e.target));
      if (!this.someBoxActive) return;
      if (!$(e.target).hasClass('active') && !$(e.target).parents('.drag').hasClass('active')) {
        this.someBoxActive = false;
        console.log('blur');
        this.drag($('.drag'));
        $('.active').resizable('destroy').removeClass('active ants editable').find('.text-area').css('cursor', 'move');;
        $('.tool').hide();
      }
    },
    resize($ele) {
      $ele.resizable({
        containment: `.${this.$element.attr('class')}`,
      });
    },

  }
  $.fn.newBox = function (options) {
    let box = new Box(this, options);
    //创建一个框
    let $boxEle = box.createBox();
    //框能拖动
    box.drag($boxEle);
    // let currentBox;
    $(document).off().on('click','.drag',function (e) {
      box.active($(this),e);
    });
    $('.edit-area').off().click(function (e) {
      box.blur(e)
    });
    return this;
  }
  
  // blur(e) {
    
  // }
///////////////////////////////////////////////////////////
  $('.save').click(function () {
    let w = $('.canvas').width();
    let h = $('.canvas').height();
    let attribute_x = ['width', 'right', 'left'];
    let attribute_y = ['height', 'top', 'bottom'];
    $('.drag').each(function () {
      let obj = {};
      attribute_x.forEach(i => {
        obj[i] = parseInt($(this).css(i)) * 100 / w + '%';
      });
      attribute_y.forEach(i => {
        obj[i] = parseInt($(this).css(i)) * 100 / h + '%';
      });
      // console.log(obj);
      $(this).css(obj);
    });
    // }
    console.log($('.canvas').html());
  });
})(jQuery, window, document);