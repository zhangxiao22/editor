$.widget('custom.editbox', {
	options: {
		//box的类型 1：文本、2：图片、3：视频
		type: null,
		//box的状态 beginning => active => focus
		status: '',
		//box里面的内容
		internal: '',
		//box的工具
		// tools: [],
		//box的一些属性:比如文字大小
		attribute: {

		},
	},
	_create() {
		console.log('create')
		//分类 按type判断
		this._classify();
		//生成box
		let {
			internal
		} = this.options;
		this.element
			.addClass('custom-editbox')
			.html(internal);
		//初始状态：beginning
		this._beginStatus();

	},
	_init() {
		console.log('init');
		// let _this = this;
		// this.document.on('click',this.element,function(e) {
		// 	_this.active(e);
		// })
		// this._on(this.element, {
		// 	click: 'active'
		// });
	},
	_setOptions(options) {
		// console.log('setopt');
		this._super(options);
		// this.refresh();
		// this._trigger("add_draggable", )
	},
	_classify() {
		// console.log(this.options.tools)
		let type = this.options.type;
		if (type === 1) {
			//文本
			this.element.css('padding', '5px');
			this.options.internal = `<div class="text-area" contenteditable="true"></div>`;
			this.tools = ['font_size_input', 'text_align_left_btn', 'text_align_right_btn', 'text_align_center_btn', 'text_align_justify_btn', 'box_link_input', 'box_clear_btn'];
			this.options.attribute = {
				fontSize: 20,
				direction: 'left',
			};

		} else if (type === 2) {
			//图片
		} else if (type === 3) {
			//视频
		}
	},
	active(e) {
		e.stopPropagation();
		status = this.options.status;
		// console.log(status);
		if (status === 'beginning') {
			//选中，能缩放
			$(':custom-editbox').editbox('blur', e);
			this._activeStatus(true)._resizeAble(true)._hideTools()._showTools(this.tools);
			this.options.status = 'active';
		} else if (status === 'active') {
			//焦点，能编辑，能缩放，不能拖动
			this._draggAble(false)._focusStatus(true);
			this.options.status = 'focus';
		} else if (status === 'focus') {
			return;
		}
	},
	_beginStatus() {
		//能拖拽,不能缩放
		this._draggAble(true);
		this.options.status = 'beginning';
	},
	_activeStatus(b) {
		if (b) {
			this.element.addClass('active');
		} else {
			this.element.removeClass('active');
		}
		return this;
	},
	_focusStatus(b) {
		if (b) {
			this.element.addClass('focus').find('.text-area').focus();
		} else {
			this.element.removeClass('active focus').find('.text-area').blur();
		}
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
				minWidth: this.options.type === 1 ? this.options.attribute.fontSize : null,
				start() {
					// $(this).resizable('option', 'maxHeight', $(this).height());
				},
				resize() {
					$(this).resizable('option', 'maxHeight', $(this).find('.text-area').height());
					$(this).resizable('option', 'minHeight', $(this).find('.text-area').height());
				},
				stop() {
					//非常关键，防止有高度后，再输入或删除文字高度不会变
					_this.element.css('height', 'auto');
				}
				// maxHeight: this.options.type === 1 ? this.element.height() : null
			} :
			'destroy';
		this.element.resizable(resizeOption);
		return this;
	},
	_tools() {
		let _this = this;
		//文字对齐
		let _font_align_btn = direction => {
			// console.log(_this.options.attribute.direction);

			let class_name = direction === 'left' ? 'fa-align-left' : direction === 'right' ? 'fa-align-right' : direction === 'center' ? 'fa-align-center' : direction === 'justify' ? 'fa-align-justify' : '';
			return $('<button class="text-align-btn"></button>')
				.append('<i class="fas ' + class_name + '"></i>')
				.addClass(_this.options.attribute.direction === direction ? 'active' : '')
				.click(function () {
					$(this).addClass('active').siblings('.text-align-btn').removeClass('active');
					_this.element.find('.text-area').css({
						'text-align': direction,
						'text-align-last': direction === 'justify' ? 'justify' : 'unset'
					});
					_this.options.attribute.direction = direction;
				});
		}
		return {
			//改变文字大小
			font_size_input() {
				return $('<input type="text" />').val(_this.options.attribute.fontSize).on('input', function () {
					//改变文字大小
					_this.element.find('.text-area').css('font-size', $(this).val() + 'px');
					// _this.element.css('height', _this.element.find('.text-area').height());
					//改变box文字大小属性
					_this.options.attribute.fontSize = $(this).val();
				});
			},
			//文字左对齐
			text_align_left_btn() {
				return _font_align_btn('left');
			},
			//文字右对齐
			text_align_right_btn() {
				return _font_align_btn('right');
			},
			//文字居中
			text_align_center_btn() {
				return _font_align_btn('center');
			},
			//文字两边对齐
			text_align_justify_btn() {
				return _font_align_btn('justify');
			},

			//添加超链接
			box_link_input() {
				let $button = $('<button>ok</button>');
				let $input = $('<input type="text" />').val(_this.options.attribute.href);
				let $div = $('<div></div>').append($input).append($button);
				$button.click(function () {
					console.log($input.val());
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
		for (let i of tools) {
			if (this._tools()[i]) {
				$('.tools').append(this._tools()[i]());
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
			this._draggAble(true)._resizeAble(false)._focusStatus(false)._hideTools();
			this.options.status = 'beginning';
		}
	},

	_destroy() {
		console.log('destroy');
		// this.element.removeClass('');
	}
});