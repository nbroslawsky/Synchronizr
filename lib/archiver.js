module.exports = function(type) {

	var type = type || 'tar';
	return require('./archivers/'+type+'.js')

}