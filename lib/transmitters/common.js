module.exports = {
	_openerPattern : '--<TCP-DATA-STARTS-HERE>--',
	_closerPattern : '--<TCP-DATA-ENDS-HERE>--',
	transmitify : function(data) {
		return this._openerPattern + JSON.stringify(data) + this._closerPattern;
	},
	parseStream : function(str) {

		var regex = new RegExp(this._openerPattern + '(.*)' + this._closerPattern);
		var parsedData = undefined;
		str = str.replace(regex, function(wholeMatch, dataStr, pos, origStr) {
		    parsedData = JSON.parse(dataStr) || null;
		    return '';
		});

		return {
			str : str,
			obj : parsedData
		};
	}

};