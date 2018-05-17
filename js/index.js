$.widget('custom.editbox', {
	options: {
		type: null,
		status: '',
		internal: '',
		tools: [],
		attribute: {},
	},
	_create() {
		console.log('create')
		this._classify();
		let {
			internal
		} = this.options;
		this.element
			.addClass('custom-editbox')
			.html(internal);
		//能缩放
		// this._resizeAble(true);
		//选中状态
		// this._active(true);
		this._beginStatus();
		// this._blur();
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
		console.log('setopt');
		this._super(options);
		this.refresh();
		// this._trigger("add_draggable", )
	},
	_classify() {
		// console.log('re')
		let type = this.options.type;
		if (type === 1) {
			//文本
			this.element.css('padding', '5px');
			this.options.internal = `<div class="text-area" contenteditable="true" data-placeholder="文本"></div>`;
			this.options.tools = ['font_size_input', 'color_input'];
			this.options.attribute = {
				fontSize: 20,
			};
			this._on(this.element.find('.text-area'), {
				'input': function () {
					console.log(123)
				}
			});
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
			this._activeStatus(true)._resizeAble(true)._hideTools()._showTools(this.options.tools);
			this.options.status = 'active';
		} else if (status === 'active') {
			//焦点，能编辑，能缩放，不能拖动
			this._draggAble(false)._focusStatus(true)._hideTools()._showTools(this.options.tools);
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
			this.element.addClass('focus').find('.text-area').focus().css('cursor', 'text');
		} else {
			this.element.removeClass('active focus').find('.text-area').blur().css('cursor', 'move');
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
					//很关键，防止有高度后，再输入或删除文字高度不会变
					_this.element.css('height','auto');
				}
				// maxHeight: this.options.type === 1 ? this.element.height() : null
			} :
			'destroy';
		this.element.resizable(resizeOption);
		return this;
	},
	_tools() {
		let _this = this;
		return {
			font_size_input() {
				return $('<input />').val(_this.options.attribute.fontSize).on('input', function () {
					_this.element.find('.text-area').css('font-size', $(this).val() + 'px');
					_this.element.css('height', _this.element.find('.text-area').height());
					_this.options.attribute.fontSize = $(this).val();
				});
			},
			color_input() {
				return null;
			}
		}
	},
	_showTools(tools) {
		// let tools = 
		for (let i of tools) {
			$('.tool-area').append(this._tools()[i]());
		}

		// let _this = this;
		// $('<input>').val(this.options.attribute.fontSize).appendTo('.tool-area').on('input',function() {
		// 	console.log($(this).val());
		// 	_this.element.find('.text-area').css('font-size',$(this).val()+'px');
		// 	_this.element.css('height',_this.element.find('.text-area').height());
		// 	_this.options.attribute.fontSize = $(this).val();
		// });
		// console.log(b);

		return this;
	},
	_hideTools() {
		$('.tool-area').empty();
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
		// this.element
		//     .removeClass("progressbar")
		//     .text("");
	}
});