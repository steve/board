var Pull = {
	start : function() {
		$.CouchApp(function(app) {
			Cushion.onTopOf(app, "stream",
				{
					group: true
				}, {
					"Stop": Stop,
					"Work": Work
				},
				function () {
				        $(".connectedSortable").sortable({
				            connectWith: '.connectedSortable',
							dropOnEmpty: true
				        }).disableSelection();

						$("#stream").sortable().disableSelection();

						// now go over and initialize any newly created thickbox

						// initialize thickbox on the ready-to-be-thickbox
						tb_init('a.ready-to-be-thickbox');//pass where to apply thickbox
						// because these are now initialized, remove class ready-to-be-thickbox
						$(".ready-to-be-thickbox").removeClass("ready-to-be-thickbox");

						// now go over and initialize any newly created draggables or droppables

						// initialize draggable on the ready-to-be-draggable
						$(".ready-to-be-draggable").draggable({containment: '.droppable'});
						$(".ready-to-be-draggable").draggable();
						// because these are now initialized, remove class ready-to-be-draggable
						$(".ready-to-be-draggable").removeClass("ready-to-be-draggable");

						// initialize droppable on the ready-to-be-droppable
						$(".ready-to-be-droppable").droppable({
							drop : function(event, ui) {
								var work = ui.draggable.data("work");
								var foo = $(this);
								var p = $(this).position();
								var top = ui.position.top;
								var left = ui.position.left;
								work.stop($(this).data("stop"), top, left);
							}
						});
						// because these are now initialized, remove class ready-to-be-droppable
						$(".ready-to-be-droppable").removeClass("ready-to-be-droppable");
				}
			);

			$(".draggable").draggable();
			$(".droppable").droppable({
				drop: function(event, ui) {
					$(this).addClass('ui-state-highlight').find('p').html('Dropped!');
					$(ui.draggable).addClass('foo');
				},
				out: function(event, ui) {
					$(this).addClass('ui-state-highlight').find('p').html('empty');
					$(ui.draggable).removeClass('foo');
				}

			});
		});
	}
}
//
// Stop
// this represents a 'stop' in the stream
//
// When created, register it and create the static HTML to visualize this stop
//
function Stop(json) {
	this.id = json._id;

	$("#stops").append("<div id='" + this.id + "' class='ready-to-be-droppable droppable ui-widget-header' style='position: relative'></div>");
	$("#stops > #" + this.id).data("stop", this);

	this.updateByJSON(json);

}

Stop.prototype.updateByJSON = function(json) {
	this.name = json.name;
	this.position = json.position;

	// now update...
	//$("#stops > #" + this.id).html("<p>" + this.id + " " + this.name + "</p>");
}

//
// Work
// this represents a 'work' in the stream
//
// When created, register it and create the static HTML to visualize this work
//
function Work(json) {
	this.id = json._id;
	this.stop_id = json.stop_id;

	$("#" + this.stop_id).append("<div id='" + this.id + "' class='ready-to-be-draggable draggable ui-widget-content'></div>");
	this.jquery_draggable = $("#" + this.stop_id + " > #" + this.id);
	this.jquery_draggable.data("work", this);

	this.updateByJSON(json);
}

Work.prototype.stop = function(stop, top, left) {
	this.stop_id = stop.id;
	this.top = top;
	this.left = left;

	this.save();

	this.updateRendering();
}

Work.prototype.toJSON = function() {
	var json = {
		_id: this.id,
		_rev: this._rev,
		original_url: this.original_url,
		title: this.title,
		stop_id: this.stop_id,
		top: this.top,
		left: this.left,
		cushion_type: "Work"
	};
	return json;
}

Work.prototype.updateByJSON = function(json) {
	this._rev = json._rev;
	this.title = json.title;
	this.top = json.top || 0;
	this.left = json.left || 0;
	this.original_url = json.original_url;

	this.updateRendering();
};

Work.prototype.updateRendering = function() {
	var j = this.jquery_draggable;
	j.css({
		top: this.top,
		left: this.left,
		position: "absolute"
	});
	this.jquery_draggable.html("<p>" + this.title +
		"(" + this.left + ", " + this.top + ")</p>" +
		"<a href='" + this.original_url + "TB_iframe=true&height=250&width=400" +
		"' class='ready-to-be-thickbox thickbox'>" + "(original)</a>");
};

