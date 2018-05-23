$.widget('custom.editbox', {
	options: {
		public_classname: 'custom-editbox',
		//box的状态 beginning => active => focus
		status: 'beginning',
		//box里面的内容
		internal: '',
		//box的一些属性:比如文字大小
		attribute: {},
	},
	_create() {
		// console.log('create')
		this.element
			.addClass(`${this.options.public_classname} ${this.options.private_classname}`)
			.html(this.options.internal);
	},
	_init() {
		// console.log('init');
		//初始状态：beginning
		this._beginStatus();
		this._on({'click':'active'})
	},
	//改变options时执行
	_setOptions: function () {
		console.log('seropts')
		this._superApply(arguments);
	},

	_setOption: function (key, value) {
		console.log('seropt')
		this._super(key, value);
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
			} :
			'destroy';
		this.element.resizable(resizeOption);
		return this;
	},
	//右侧工具
	_pubTools() {
		let _this = this;
		return {
			//添加超链接
			box_link_input() {
				let $button = $('<button>ok</button>');
				let $input = $('<input type="text" />').val(_this.options.attribute.href);
				let $div = $('<div></div>').append($input).append($button);
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
		console.log('trigger_blur');
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