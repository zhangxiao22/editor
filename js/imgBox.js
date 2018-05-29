$.widget('custom.imgbox', $.custom.editbox, {
	options: {
		private_classname: 'editbox-img',
		internal: '<div class="image-area"><i class="fas fa-image"></i></div>',
		tools: [
			'img_upload_btn',
			'img_size_btn',
			'img_position_x_btn',
			'img_position_y_btn',
			'box_link_input',
			'box_bg_input',
			'box_size_btn',
			'box_index_module',
			'box_clear_btn',
		],
		attribute: {
			backgroundSize: 'auto',
			backgroundPositionX: 'left',
			backgroundPositionY: 'top',
		},
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
			return;
		}
	},
	_tools() {
		let _this = this;
		let _img_size_fn = size => {
			if (size === 'cover') {
				class_name = 'fa-expand';
				title_name = '覆盖';
			} else if (size === 'contain') {
				class_name = 'fa-compress';
				title_name = '限制';
			} else if (size === 'tiling') {
				class_name = 'fa-expand-arrows-alt';
				title_name = '平铺';
			} else if (size === 'auto') {
				class_name = 'fa-magic';
				title_name = '自动';
			}
			return $('<button title="' + title_name + '"></button>')
				.append('<i class="fas ' + class_name + '"></i>')
				.addClass(_this.options.attribute.backgroundSize === size ? 'active' : '')
				.click(function () {
					$(this).addClass('active').siblings('button').removeClass('active');
					_this.element.find('.image-area').css({
						'background-size': size === 'tiling' ? '100% 100%' : size,
					});
					_this.options.attribute.backgroundSize = size;
				});
		};
		let _img_position_x_fn = direction => {
			if (direction === 'left') {
				class_name = 'fa-step-backward';
				title_name = '居左';
			} else if (direction === 'center') {
				class_name = 'far fa-minus-square';
				title_name = '水平居中';
			} else if (direction === 'right') {
				class_name = 'fa-step-forward';
				title_name = '居右';
			}

			return $('<button title="' + title_name + '"></button>')
				.append('<i class="fas ' + class_name + '"></i>')
				.addClass(_this.options.attribute.backgroundPositionX === direction ? 'active' : '')
				.click(function () {
					$(this).addClass('active').siblings('button').removeClass('active');
					_this.element.find('.image-area').css({
						'background-position-x': direction,
					});
					_this.options.attribute.backgroundPositionX = direction;
				});
		};
		let _img_position_y_fn = direction => {
			if (direction === 'top') {
				class_name = 'fa-step-backward';
				title_name = '居上';
			} else if (direction === 'center') {
				class_name = 'far fa-minus-square';
				title_name = '竖直居中';
			} else if (direction === 'bottom') {
				class_name = 'fa-step-forward';
				title_name = '居下';
			}

			return $('<button title="' + title_name + '"></button>')
				.append('<i class="fas ' + class_name + '"></i>')
				.addClass(_this.options.attribute.backgroundPositionY === direction ? 'active' : '')
				.click(function () {
					$(this).addClass('active').siblings('button').removeClass('active');
					_this.element.find('.image-area').css({
						'background-position-y': direction,
					});
					_this.options.attribute.backgroundPositionY = direction;
				});
		};
		return {
			// 上传图片
			img_upload_btn() {
				let $i = $('<i class="fas fa-upload tools-upload-i">');
				let $input = $('<input title="上传图片" type="file" accept="image/gif,image/jpeg,image/jpg,image/png" class="tools-upload-btn" />');
				let $div = $('<div class="tools-upload-div">').append($i, $input);
				//上传图片
				$input.change(function () {
					let f = $(this)[0].files[0];
					_this.element.find('.image-area').empty().css({
						'background-image': `url(${GET_LOCAL_IMG(f)})`,
					})
					let type = f.name.split('.')[f.name.split('.').length - 1].toLowerCase();
					if (IS_IMG.includes(type)) {
						// data.set('file', f);
					} else {
						$(this).val('');
						return alert('上传图片格式不正确');
					}
				});
				return $div;
			},
			//图片展示方式
			img_size_btn() {
				return $('<div class="clearfix tool-line button-group">')
				.append(_img_size_fn('cover'), _img_size_fn('contain'), _img_size_fn('tiling'), _img_size_fn('auto'));
			},
			img_position_x_btn() {
				return $('<div class="clearfix tool-line button-group tools-img-position-x-div">')
				.append(_img_position_x_fn('left'), _img_position_x_fn('center'), _img_position_x_fn('right'));
			},
			img_position_y_btn() {
				return $('<div class="clearfix tool-line button-group tools-img-position-y-div">')
				.append(_img_position_y_fn('top'), _img_position_y_fn('center'), _img_position_y_fn('bottom'));
			}
		}
	},
});