/* globals Components, addMessageListener, removeMessageListener, PageThumbUtils */
Components.utils.import('resource://gre/modules/PageThumbUtils.jsm');

let listener = {
	_messages: [
		'NewTabTools:uncacheThumbnailPrefs',
		'NewTabTools:disable'
	],
	init: function() {
		for (let m of this._messages) {
			addMessageListener(m, this);
		}

		PageThumbUtils._oldGetContentSize = PageThumbUtils.getContentSize;
		PageThumbUtils.getContentSize = function(window) {
			let [width, height] = PageThumbUtils._oldGetContentSize(window);
			return [
				Math.min(16384, width),
				Math.min(16384, height + window.scrollMaxY)
			];
		};
	},
	destroy: function() {
		for (let m of this._messages) {
			removeMessageListener(m, this);
		}

		PageThumbUtils.getContentSize = PageThumbUtils._oldGetContentSize;
		delete PageThumbUtils._oldGetContentSize;
	},
	receiveMessage: function(message) {
		switch (message.name) {
		case 'NewTabTools:uncacheThumbnailPrefs':
			delete PageThumbUtils._thumbnailWidth;
			delete PageThumbUtils._thumbnailHeight;
			break;
		case 'NewTabTools:disable':
			this.destroy();
			break;
		}
	}
};
listener.init();
