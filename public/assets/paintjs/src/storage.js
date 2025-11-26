// @TODO: remove remaining cruft from being compiled from CoffeeScript
// or maybe replace this module with localforage actually
// (but need to address asynchronous concerns if doing that)

((exports) => {
	let localStore = {
		get(key, callback) {
			let obj = {};
			if (typeof key === "string") {
				obj = null;
			} else if (Array.isArray(key)) {
				obj = {};
			} else {
				obj = key;
			}
			callback(null, obj);
		},
		set(key, value, callback) {
			callback(null);
		}
	};

	exports.storage = localStore;

})(window);
