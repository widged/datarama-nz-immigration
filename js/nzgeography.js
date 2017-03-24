	window.onload = function() {
		var R = Raphael("paper", 500, 500);
		var attr = {
			fill : "#ffffff",
			stroke : "#ffffff",
			"stroke-width" : 0.0,
			"stroke-linejoin" : "round"
		};



	var scale = getScaleAmount({ width: R.width, height: R.height });
	var current = null;

	regions.forEach((d, i) => {
		var region = R.path(d.shape).attr(attr);
		region.color = Raphael.getColor();
		region.scale(scale, 0, 0, scale);
		(function(st, region, d) {
			var {uid} = d;
		  st[0].style.cursor = "pointer";
		  st[0].onmouseover = function() {
				document.getElementById("panel").innerHTML = `<div id="${uid}" class="region-desc">
					<h2>${d.label}</h2>
					<div id="region-tree"></div>
					<div id="region-pie"></div>
					<div id="region-row" class="region-row"></div>
				</div>`;
				var {rpath} = current || {};
		    rpath && rpath.animate({
		          fill : "#ffffff",
		          stroke : "#ffffff"
		        }, 500) && (document.getElementById("panel").style.display = "");
		    st.animate({
		      fill : st.color,
		      stroke : "#ccc"
		    }, 500);

		    st.toFront();
		    R.safari();

		    document.getElementById(uid).style.display = "block";
		    current = {uid: d.uid, rpath: region};
				drawChart(document.getElementById("panel"), d.chart)
		  };
		  st[0].onmouseout = function() {
		    st.animate({
		      fill : "#ffffff",
		      stroke : "#f8f8f8"
		    }, 500);
		    st.toFront();
		    R.safari();
		  };

		})(region, region, d);
	});

};

function getScaleAmount (canvasSize) {
    var cs = canvasSize ? canvasSize : this._canvasSize;

    var reqRatio = 540 / 750;
    if (cs.height * reqRatio > cs.width) {
        return (cs.width / 750) * 1;
    }
    return (cs.height / 940) * 1;
};
