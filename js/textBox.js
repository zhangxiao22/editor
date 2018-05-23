$.widget('custom.textbox', $.custom.editbox, {
	options: {
		private_classname: 'editbox-text',
		internal: '<div class="text-area" contenteditable="true"></div>',
		tools: [
			'font_size_input',
			'text_align_left_btn',
			'text_align_right_btn',
			'text_align_center_btn',
			'text_align_justify_btn',
			'box_link_input',
			'box_clear_btn'
		],
		attribute: {
			fontSize: 20,
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
			$('.editbox-text').textbox('blur');
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
			// console.log(_this.options.attribute.direction);

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
			font_size_input() {
				return $('<input type="text" />').val(_this.options.attribute.fontSize).on('input', function () {
					_this.element.css('min-width',$(this).val() + 'px')
					//改变文字大小
					_this.element.find('.text-area').css('font-size', $(this).val() + 'px');
					// _this.element.css('height', _this.element.find('.text-area').height());
					//改变box文字大小属性
					_this.options.attribute.fontSize = parseInt($(this).val());
					//改变缩放设置
					_this._resizeAble(true);
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
		}
	},
});
// $(document).on('click', '.editbox-text', function (e) {
// 	console.log('click')
// 	$(this).textbox('active', e);
// });