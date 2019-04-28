function XCMVVM(el, option) {
	this.el = document.querySelector(el);
	this.data = option.data || {}
	this.methods = option.methods || {}
	// 常量
	this.REG = /xc-(\w+)/;
	this.MVTYPES = {

	}

	this.watchers = [];

	this.init();
	
}

XCMVVM.prototype.callWatchers = function() {
	this.watchers.forEach((watcher) => {
		watcher();
	})
}

XCMVVM.prototype.traverse = function(el) {
	const attrs = el.attributes;

	Array.prototype.slice.call(attrs).forEach((attr) => {
		const m = attr.name.match(this.REG);
		console.log('attr: ', attr)
		if (!m) return;

		const attrName = m[1];
		const attrValue = attr.value;

		switch(attrName) {
			case 'model':
				// console.log('model: ', attrValue)
				if (this.data[attrValue]) {
					el.innerHTML = this.data[attrValue];
					this.watchers.push(() => {
						el.innerHTML = this.data[attrValue];
					})
				}
				
				break;
			case 'click':
				el.addEventListener("click", e => {
					// console.log('....attrValue...', attrValue)
					// console.log('...methods....', this.methods)
					// console.log('...data....', this.data)
					// expr(attrValue, this.methods)
					if (this.methods[attrValue]) {
						this.methods[attrValue].apply(this.data)
					}

					this.callWatchers();
				})
		}
	})

	if (el.children) {
		Array.prototype.slice.call(el.children).forEach(cel => {
			this.traverse(cel);
		})
	}
}

XCMVVM.prototype.init = function() {
	this.traverse(this.el);
}


function expr(expr, scope) {
	try {
		with(scope) {
			// console.log('expr: ', expr)
			return eval(expr)
		}
	} catch(err) {
		console.error(err);
  		return undefined;
	}
}