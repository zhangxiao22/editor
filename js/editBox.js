const IS_IMG = ["bmp", "jpg", "jpeg", "gif", "png"];
const GET_LOCAL_IMG = (window.navigator.userAgent.indexOf("Chrome") >= 1 || window.navigator.userAgent.indexOf("Safari") >= 1) ?
	window.webkitURL.createObjectURL :
	window.URL.createObjectURL;

function blurAll() {
	$('.editbox-text').textbox('blur');
	$('.editbox-img').imgbox('blur');
}
$.fn.extend({
	delayInput(callback, time = 500) {
		let t;
		this.on('keyup', function () {
			clearTimeout(t);
			t = setTimeout(_ => {
				callback.call(this);
			}, time);
		});
		this.on('focus', function () {
			this.select();
		});
		return this;
	},
});
$.widget('custom.editbox', {
	options: {
		public_classname: 'custom-editbox',
		//box的状态 beginning => active => focus
		status: 'beginning',
		//box里面的内容
		internal: '',
		//box的一些属性
		attribute: {
			width: null,
			height: null,
			bgColor: null,
			zIndex: 0,
		},
	},
	_create() {
		// console.log('create')
		this.element
			.addClass(`${this.options.public_classname} ${this.options.private_classname}`)
			.html(this.options.internal)
	},
	_init() {
		// console.log('init');
		//初始状态：beginning
		this._beginStatus()
			._setWidth(this.options.attribute.width)
			._setHeight(this.options.attribute.height)
			._setZIndex(this.options.attribute.zIndex)
			._methods();
		this._on({
			'click': 'active'
		});
	},
	//改变options时执行
	_setOptions: function () {
		console.log('setopts')
		this._superApply(arguments);
	},

	_setOption: function (key, value) {
		console.log('setopt')
		this._super(key, value);
	},

	_beginStatus() {
		//能拖拽,不能缩放
		this._draggAble(true);
		this.options.status = 'beginning';
		return this;
	},
	_activeStatus(b) {
		if (b) {
			this.element.addClass('active');
		} else {
			this.element.removeClass('active');
		}
		return this;
	},
	_focusStatus() {
		return this;
	},
	_draggAble(b) {
		let _this = this;
		let dragOption = b ? {
				// 约束在指定元素或区域的边界内拖拽
				containment: 'parent',
				// 元素是否对齐到其他元素
				snap: '.custom-editbox',
				// 光标
				cursor: 'move',
				// grid: [50, 20],
			} :
			'destroy';
		this.element.draggable(dragOption);
		return this;
	},
	_resizeAble(b) {
		let _this = this;
		// this.element.find('.text-area').css('font-size',$(this).val()+'px');		
		let resizeOption = b ? {
				// 约束区域
				containment: 'parent',
				resize() {
					_this.options.attribute.width = _this.element.width();
					_this.options.attribute.height = _this.element.height();
					$('.box-width-input').val(_this.element.width());
					$('.box-height-input').val(_this.element.height());
				}
			} :
			'destroy';
		this.element.resizable(resizeOption);
		return this;
	},
	_setWidth(width) {
		// let minWidth = this.options.attribute.minWidth,
		// 	width = parseInt(w);
		// width = width < minWidth ? minWidth : width;
		this.element.css('width', width);
		this.options.attribute.width = width;
		return this;
	},
	_setHeight(height) {
		// let minHeight = this.options.attribute.minWidth;
		// height = width < minHeight ? minHeight : height;
		this.element.css('height', height);
		this.options.attribute.height = height;
		return this;
	},
	_setZIndex(z_index) {
		this.element.css('z-index', z_index);
		this.options.attribute.zIndex = z_index;
		return this;
	},
	//右侧工具
	_pubTools() {
		// console.log(this.options.attribute)
		let _this = this;
		return {
			//调整层次
			box_index_module() {
				let $div = $('<div class="clearfix tool-line">'),
					$minus = $('<button><i class="fas fa-minus"></i></button>').click(function () {
						let num = parseInt($input.val()) === 0 ? 0 : parseInt($input.val()) - 1;
						$input.val(num);
						_this._setZIndex(num);
					}),
					$plus = $('<button><i class="fas fa-plus"></i></button>').click(function () {
						let num = parseInt($input.val()) + 1;
						$input.val(num);
						_this._setZIndex(num);
					}),
					$input = $(`<input class="tools-input-s" type="number" value="${_this.options.attribute.zIndex}" />`).on('input', function () {
						_this._setZIndex($(this).val());
					});
				$div.append($minus, $input, $plus);
				return $div;
			},
			//背景色
			box_bg_input() {
				let $input = $('<input class="tools-input-m" style="width:100px;" value="' + (_this.options.attribute.bgColor || '') + '" />');
				let $div = $('<div class="clearfix tool-line">').append('<label>背景颜色</label>', $input);
				// $div = $('<div>').append($input);
				$input.colorpicker().change(function () {
					_this.element.css('background-color', $(this).val() || 'transparent');
					_this.options.attribute.bgColor = $(this).val();
				});
				return $div;
			},
			//尺寸
			box_size_btn() {
				let $div = $('<div>'),
					$x_input = $(`<input class="tools-input-s box-width-input" type="number" value="${_this.options.attribute.width}" />`).delayInput(function () {
						let $this = $(this),
							currentVal = parseInt($this.val()) || 0,
							val,
							left = parseInt(_this.element.css('left')),
							minWidth = _this.options.attribute.minWidth,
							maxWidth = $('.canvas').width(),
							padding = _this.options.attribute.padding;
						if (currentVal < minWidth) {
							val = minWidth;
							$this.val(val).select();
						} else if (currentVal > maxWidth) {
							val = maxWidth - padding * 2;
							$this.val(val).select();
							_this.element.css('left', 0);
						} else {
							val = currentVal;
							if ((left + val + padding * 2) > maxWidth) {
								_this.element.css({
									// 'right': 0,
									'left': maxWidth - val - padding * 2
								});
							}
						}
						_this._setWidth($this.val());
					}),
					$y_input = $(`<input class="tools-input-s box-height-input" type="number"bn ${_this.options.private_classname === 'editbox-text'?'disabled':''} value="${_this.options.attribute.height}" />`)
					.delayInput(function () {
						_this._setHeight($(this).val());
					});
				$div.append('宽:', $x_input, '高:', $y_input);
				return $div;
			},
			//box居中
			box_center_btn() {
				return $('<button>center</button>').click(function () {
					let maxWidth = $('.canvas').width(),
						width = _this.element.width(),
						padding = _this.options.attribute.padding;
					_this.element.css('left', (maxWidth - width - padding * 2) / 2);
				});
			},
			//添加超链接
			box_link_input() {
				let $button = $('<button>ok</button>');
				let $input = $('<input class="tools-input-l" type="text" />').val(_this.options.attribute.href);
				let $div = $('<div class="clearfix tool-line">').append($input).append($button);
				$button.click(function () {
					// console.log($input.val());
					if (!$.trim($input.val())) return;
					_this.element.attr('data-href', $input.val());
					_this.options.attribute.href = $input.val();
				});
				return $div;
			},
			//删除
			box_clear_btn() {
				return $('<button></button>').append('<i class="far fa-trash-alt"></i>').click(function () {
					_this._hideTools();
					_this.element.remove();
				});
			}
			//
		}
	},
	_showTools(tools) {
		let totalTools = Object.assign({}, this._pubTools(), this._tools());
		for (let i of tools) {
			if (totalTools[i]) {
				$('.tools').append(totalTools[i]());
			} else {
				console.warn(`不存在工具：${i}`);
			}
		}
		return this;
	},
	_hideTools() {
		$('.tools').empty();
		return this;
	},

	blur() {
		// console.log('trigger_blur');
		let status = this.options.status;
		if (status !== 'beginning') {
			// console.log('blur');
			this._draggAble(true)._resizeAble(false)._activeStatus(false)._focusStatus(false)._hideTools();
			this.options.status = 'beginning';
		}
	},


	getOptions() {
		console.log(this.option());
	},

	_destroy() {
		console.log('destroy');
		// this.element.removeClass('');
	}
});