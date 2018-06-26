$.widget('custom.containerbox', $.custom.editbox, {
	options: {
		private_classname: 'editbox-container',
		internal: '<div class="container-area"></div>',
		outside: true,
		tools: [
			'container_split_input',
			'box_link_input',
			'box_bg_input',
			'box_size_btn',
			'box_center_btn',
			'box_index_module',
			'box_clear_btn',
		],
		attribute: {
			padding: 0,
			width: 500,
			height: 500,
		},
	},
	active(e) {
		console.log('click container')
		e.stopPropagation();
		status = this.options.status;
		if (status === 'beginning') {
			//选中，能缩放
			blurAll();
			this
				._activeStatus(true)
				._hideTools()
				._showTools(this.options.tools);
			if(this.options.outside) this._resizeAble(true);
				
			this.options.status = 'active';
		} else if (status === 'active') {
			return;
		}
	},
	_resizeAble(b) {
		if(this.options.outside) {
			this._super(b);
		}
		return this;
	},
	_methods() {
		this.element.hover(function () {
			console.log(123);
		});
	},
	
	_tools() {
		let _this = this;
		return {
			container_split_input() {
				let $input = $('<input type="number" />').on('input', function () {
					_this.element.empty();
					let width = _this.element.width() / $(this).val(),
						height = _this.element.height();
					for (let i = 0; i < Number($(this).val()); i++) {
						let left = width * i;
						let $div = $('<div>')
							.appendTo(_this.element)
							.containerbox({
								outside: false,
								attribute: {
									width,
									height,
									left
								}
							});
					}
				});
				return $input
			}
		}
	},
});