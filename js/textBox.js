$.widget('custom.textbox', $.custom.editbox, {
	options: {
		private_classname: 'editbox-text',
		internal: '<div class="text-area" contenteditable="true"></div>',
		tools: [
			'text_size_input',
			'text_align_btn',
			'text_color_input',
			'box_link_input',
			'box_bg_input',
			'box_size_btn',
			'box_center_btn',
			'box_index_module',
			'box_clear_btn',
		],
		attribute: {
			padding:5,
			fontSize: 20,
			width: 300,
			height: 20,
			color: '#444',
			textAlign: 'left',
			minWidth : 20,
		},
	},
	_settle(opt,ele) {
		this._super(opt,ele);
		// for(let i in opt){
		// 	if(i === 'height') {
		this.element.css('height','auto');
		this.options.attribute.height = opt['height'];
		// 	}
		// }
		return this;
	},
	_focusStatus(b) {
		if (b) {
			this.element.addClass('focus').find('.text-area').focus();
		} else {
			this.element.removeClass('focus').find('.text-area').blur();
		}
		return this;
	},
	_methods() {
		this._input();
		return this;
	},
	active(e) {
		// console.log('click')
		e.stopPropagation();
		status = this.options.status;
		// console.log(status);
		if (status === 'beginning') {
			//选中，能缩放
			blurAll();
			this
				._activeStatus(true)
				._resizeAble(true)
				._hideTools()
				._showTools(this.options.tools);
			this.options.status = 'active';
		} else if (status === 'active') {
			//焦点，能编辑，能缩放，不能拖动
			this._draggAble(false)._focusStatus(true);
			this.options.status = 'focus';
		} else if (status === 'focus') {
			return;
		}
	},
	_resizeAble(b) {
		let _this = this;
		size = this.options.attribute.fontSize;
		let resizeOption = b ? {
				// 约束区域
				containment: 'parent',
				minWidth: size,
				maxHeight: size,
				minHeight: size,
				resize() {
					//非常关键，防止有高度后，再输入或删除文字高度不会变
					_this.element.css('height', 'auto');
					_this.options.attribute.width = _this.element.width();
					$('.box-width-input').val(_this.element.width());
				},
				stop() {
					// _this.element.css('height', 'auto');
				}
			} :
			'destroy';
		this.element.resizable(resizeOption);
		return this;
	},
	_input() {
		let _this = this;
		this.element.find('.text-area').on('input',function() {
			$('.box-height-input').val(_this.element.height());
			_this.options.attribute.height = _this.element.height();
		});
	},
	_setHeight(height) {
		this.element.css('height', 'auto');
		this.options.attribute.height = height;
		return this;
	},
	_tools() {
		let _this = this;
		//文字对齐
		let _text_align_fn = direction => {
			let class_name, title_name;
			if (direction === 'left') {
				class_name = 'fa-align-left';
				title_name = '左对齐';
			} else if (direction === 'right') {
				class_name = 'fa-align-right';
				title_name = '右对齐';
			} else if (direction === 'center') {
				class_name = 'fa-align-center';
				title_name = '居中';
			} else if (direction === 'justify') {
				class_name = 'fa-align-justify';
				title_name = '两边对齐';
			}
			return $('<button title="' + title_name + '"></button>')
				.append('<i class="fas ' + class_name + '"></i>')
				.addClass(_this.options.attribute.textAlign === direction ? 'active' : '')
				.click(function () {
					$(this).addClass('active').siblings('button').removeClass('active');

					_this._settle({
						'textAlign':direction,
						'textSlignLast':direction === 'justify' ? 'justify' : 'unset'
					},_this.element.find('.text-area'));

					// _this.element.find('.text-area').css({
					// 	'text-align': direction,
					// 	'text-align-last': direction === 'justify' ? 'justify' : 'unset'
					// });
					// _this.options.attribute.direction = direction;
				});
		}
		return {
			//改变文字大小
			text_size_input() {
				let $div = $('<div class="clearfix tool-line">');
				let $input = $('<input class="tools-input-s" type="number" />').val(_this.options.attribute.fontSize).delayInput(function () {
					let val = parseInt($(this).val());


					_this._settle({'minWidth':val});
					_this._settle({'fontSize':val},_this.element.find('.text-area'));

					// _this.element.css('min-width', val + 'px')
					//改变文字大小
					// _this.element.find('.text-area').css('font-size', val + 'px');
					// _this.element.css('height', _this.element.find('.text-area').height());
					// $(this).val(_this.options.attribute.fontSize);
					//改变box文字大小属性
					// _this.options.attribute.fontSize = parseInt(val) || _this.options.attribute.fontSize;
					//改变缩放设置
					_this._resizeAble(true);
				});
				$div.append('<label>文字大小</label>', $input, 'px');
				return $div;
			},
			//文本对齐方向
			text_align_btn() {
				return $('<div class="clearfix tool-line button-group">').append(_text_align_fn('left'), _text_align_fn('center'), _text_align_fn('right'), _text_align_fn('justify'));
			},
			//文本颜色
			text_color_input() {
				let $input = $('<input class="tools-input-m" style="width:100px;" value="' + _this.options.attribute.color + '" />');
				let $div = $('<div class="clearfix tool-line">').append('<label>文本颜色</label>', $input);
				// $div = $('<div>').append($input);
				$input.colorpicker().change(function () {
					_this._settle({'color':$(this).val()});
					// _this.element.css('color', $(this).val());
					// _this.options.attribute.fontColor = $(this).val();
				});
				return $div;

			},
		}
	},
});
// $(document).on('click', '.editbox-text', function (e) {
// 	console.log('click')
// 	$(this).textbox('active', e);
// });