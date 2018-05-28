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
			'box_index_module',
			'box_clear_btn',
		],
		attribute: {
			fontSize: 20,
			fontColor: '#444',
			direction: 'left',
		},
	},

	_focusStatus(b) {
		if (b) {
			this.element.addClass('focus').find('.text-area').focus();
		} else {
			this.element.removeClass('focus').find('.text-area').blur();
		}
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
					// $(this).resizable('option', 'maxHeight', size);
					// $(this).resizable('option', 'minHeight', size);
					//非常关键，防止有高度后，再输入或删除文字高度不会变
					_this.element.css('height', 'auto');
				},
				stop() {
					// _this.element.css('height', 'auto');
				}
			} :
			'destroy';
		this.element.resizable(resizeOption);
		return this;
	},
	_tools() {
		let _this = this;
		//文字对齐
		let _font_align_btn = direction => {
			let class_name = direction === 'left' ? 'fa-align-left' : direction === 'right' ? 'fa-align-right' : direction === 'center' ? 'fa-align-center' : direction === 'justify' ? 'fa-align-justify' : '';
			let title_name = direction === 'left' ? '左对齐' : direction === 'right' ? '右对齐' : direction === 'center' ? '居中' : direction === 'justify' ? '两边对齐' : '';
			return $('<button title="' + title_name + '" class="text-align-btn"></button>')
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
			text_size_input() {
				let $div = $('<div class="clearfix tool-line">');
				let $input = $('<input class="tools-input-s" type="text" />').val(_this.options.attribute.fontSize).on('input', function () {
					let val = $(this).val();
					if (isNaN(val)) return;
					_this.element.css('min-width', val + 'px')
					//改变文字大小
					_this.element.find('.text-area').css('font-size', val + 'px');
					// _this.element.css('height', _this.element.find('.text-area').height());
					//改变box文字大小属性
					_this.options.attribute.fontSize = parseInt(val);
					//改变缩放设置
					_this._resizeAble(true);
				});
				$div.append('<label>文字大小</label>', $input, 'px');
				return $div;
			},
			//文本对齐方向
			text_align_btn() {
				return $('<div class="clearfix tool-line">').append(_font_align_btn('left'), _font_align_btn('center'), _font_align_btn('right'), _font_align_btn('justify'));
			},
			//文本颜色
			text_color_input() {
				let $input = $('<input class="tools-input-m" style="width:100px;" value="' + _this.options.attribute.fontColor + '" />');
				let $div = $('<div class="clearfix tool-line">').append('<label>文本颜色</label>', $input);
				// $div = $('<div>').append($input);
				$input.colorpicker().change(function () {
					_this.element.css('color', $(this).val());
					_this.options.attribute.fontColor = $(this).val();
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