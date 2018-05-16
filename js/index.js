$.widget('custom.editbox', {
	options: {
		type: null,
		// className: 'edit-box',
		status: ''
	},
	_create() {
		console.log('create')
		let internal = this.classify(),
			className = this.options.className;
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
		let _this = this;
		// this.document.on('click',this.element,function(e) {
		// 	_this.active(e);
		// })
		this._on(this.element, {
			click: 'active'
		});
	},
	_setOptions(options) {
		this._super(options);
		// this.refresh();
		// this._trigger("add_draggable", )
	},
	classify() {
		let internal,
			type = this.options.type;
		if (type === 1) {
			//文本
			internal = `<div class="text-area" contenteditable="true" data-placeholder="文本"></div>`;
		} else if (type === 2) {
			//图片
		} else if (type === 3) {
			//视频
		}
		return internal;
	},
	active(e) {
		// let _this = this;
		
		e.stopPropagation();
		status = this.options.status;
		console.log(status);
		if (status === 'beginning') {
			//选中，能缩放
			this._active(true)._resizeAble(true);
			this.options.status = 'active';
		} else if (status === 'active') {
			//焦点，能编辑，能缩放，不能拖动
			this._draggAble(false)._focus(true);
			this.options.status = 'focus';
		} else if (status === 'focus') {
			return;
		}
		// });
		// return this;
	},
	_beginStatus() {
		//能拖拽,不能缩放
		this._draggAble(true);
		this.options.status = 'beginning';
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
				// start() {
				// 	// console.log(_this);
				// 	$(':custom-editbox').editbox("option", "disabled")
				// },
				drag() {

				},
				stop() {
					// _this._on( this.element, {click: "active"} );
					
				}
			} :
			'destroy';
		this.element.draggable(dragOption);
		return this;
	},
	_resizeAble(b) {
		let resizeOption = b ? {
				// 约束区域
				containment: 'parent',
			} :
			'destroy';
		this.element.resizable(resizeOption);
		return this;
	},
	_active(b) {
		if (b) {
			this.element.addClass('active ants');
		} else {
			this.element.removeClass('active ants');
		}
		return this;
	},
	_focus(b) {
		if (b) {
			this.element.addClass('focus').find('.text-area').focus().css('cursor', 'text');
		} else {
			this.element.removeClass('active ants focus').find('.text-area').css('cursor', 'move');
		}
		return this;
	},
	blur() {
		console.log('trigger_blur');
		let status = this.options.status;
		if (status !== 'beginning') {
			console.log('blur');
			this._draggAble(true)._resizeAble(false)._focus(false);
			this.options.status = 'beginning';
		}
		//  if (!is_active) return;
		// console.log($(e.target).attr('class'));
		// let $currentElement = $(e.target);
		// if (!$currentElement.hasClass('active') && !$currentElement.parents('.custom-editbox').hasClass('active')) {
		//   // is_active = false;
		//   console.log('blur');
		//   $('.edit-box').draggable({
		// 		// 约束在指定元素或区域的边界内拖拽
		// 		containment: 'parent',
		// 		// 元素是否对齐到其他元素

		// 		// 光标
		// 		cursor: 'move',
		// 	});
		//   // if(!$('.ants').hasClass('focus')) {
		//   $('.edit-box').resizable('destroy');
		//   // }
		//   $('.edit-box').removeClass('active ants focus').find('.text-area').css('cursor', 'move');;
		//   // $('.tool').hide();
		// }

	},
	
	whatever() {
		console.log('what');
	},
	_destroy() {
		console.log('destroy');
		// this.element
		//     .removeClass("progressbar")
		//     .text("");
	}
});