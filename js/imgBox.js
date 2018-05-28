$.widget('custom.imgbox', $.custom.editbox, {
	options: {
		private_classname: 'editbox-img',
		internal: '<div class="image-area"><i class="fas fa-image"></i></div>',
		tools: [
			'upload_img_btn',
			'box_link_input',
			'box_bg_input',
			'box_index_module',
			'box_clear_btn',
		],
		attribute: {
		
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
		return {
			// 上传图片
			upload_img_btn() {
				let $i = $('<i class="fas fa-upload tools-upload-i"></i>');
				let $input = $('<input title="上传图片" type="file" accept="image/gif,image/jpeg,image/jpg,image/png" class="tools-upload-btn" />');
				let $div = $('<div class="tools-upload-div"></div>').append($i).append($input);
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
		}
	},
});