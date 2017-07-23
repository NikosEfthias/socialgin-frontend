module.exports = {
	parse: function (cookieName) {
		var a = document.cookie.replace(/; /g, ";").split(";"),
			b = a.length,
			c = {},
			nm = cookieName || !1;
		while (b--) {
			var d = a[b].split(/=(.+)/);
			c[d[0]] = d[1];
		}
		return (nm) ? c[nm] : c;
	},
	make: function (name, value, expiresInX_days, path) {
		var a = new Date;
		var expires = expiresInX_days || 1;
		a.setTime(Date.now() + (1000 * 60 * 60 * 24 * expires));
		var pt = path ? " ; path=" + path + ";" : ";";
		return (document.cookie = name + "=" + value + ";" + "expires=" + a.toUTCString() + pt) ? !0 : !1;
	},
	rm: function (cookieName) {
		var a = new Date;
		a.setTime(0);
		return (document.cookie = cookieName + "=;" + a.toUTCString()) ? !0 : !1;
	}

}