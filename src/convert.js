/*
 * [convert.js]{@link https://rot47.net/_js/convert.js}
 *
 * Modified from original
 */
function convert(src, srctable, desttable) {
	var srclen = srctable.length;
	var destlen = desttable.length;
	var numlen = src.length;
	
	var val = 0;
	
	for (var i = 0; i < numlen; i++) {
		val = val * srclen + srctable.indexOf(src.charAt(i));
	}
	if (val < 0) {
		return 0;
	}
	
	var r = val % destlen;
	var res = desttable.charAt(r);
	var q = Math.floor(val / destlen);
	
	while (q) {
		r = q % destlen;
		q = Math.floor(q / destlen);
		res = desttable.charAt(r) + res;
	}
	return res;
}