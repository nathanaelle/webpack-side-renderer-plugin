module.exports = {
	default: function(locals) {
		return JSON.stringify(Object.keys(locals))
	}
}