
// util functions
function addInRoomItem(name, thumbnail, qty) {
	var qty = qty || 1;
	var addedItemsDiv = $("#in-room-items");
	var inRoomItem = addedItemsDiv.find('#' + name.split(' ').join('-'));
	if (!inRoomItem.length) {
		//add item if not exist yet
		var html =
			`<div class="img-thumbnail inRoom-item" id="${name.split(' ').join('-')}">
			<img src="${thumbnail}" alt="${name}">
			<div>${name} x
			<strong class="item-qty">${qty}</strong>
			</div>
			</div>
		`;
		addedItemsDiv.append(html);
	} else {
		var curQty = Number(inRoomItem.find('.item-qty').text());
		inRoomItem.find('.item-qty').text(curQty + 1);
	}
}


// font-end controllers

/*
 * Camera Buttons
 */

var CameraButtons = function(blueprint3d) {

  var orbitControls = blueprint3d.three.controls;
  var three = blueprint3d.three;

  var panSpeed = 30;
  var directions = {
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
  }

  function init() {
    // Camera controls
    $("#zoom-in").click(zoomIn);
    $("#zoom-out").click(zoomOut);  
    $("#zoom-in").dblclick(preventDefault);
    $("#zoom-out").dblclick(preventDefault);

    $("#reset-view").click(three.centerCamera)

    $("#move-left").click(function(){
      pan(directions.LEFT)
    })
    $("#move-right").click(function(){
      pan(directions.RIGHT)
    })
    $("#move-up").click(function(){
      pan(directions.UP)
    })
    $("#move-down").click(function(){
      pan(directions.DOWN)
    })

    $("#move-left").dblclick(preventDefault);
    $("#move-right").dblclick(preventDefault);
    $("#move-up").dblclick(preventDefault);
    $("#move-down").dblclick(preventDefault);
  }

  function preventDefault(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function pan(direction) {
    switch (direction) {
      case directions.UP:
        orbitControls.panXY(0, panSpeed);
        break;
      case directions.DOWN:
        orbitControls.panXY(0, -panSpeed);
        break;
      case directions.LEFT:
        orbitControls.panXY(panSpeed, 0);
        break;
      case directions.RIGHT:
        orbitControls.panXY(-panSpeed, 0);
        break;
    }
  }

  function zoomIn(e) {
    e.preventDefault();
    orbitControls.dollyIn(1.1);
    orbitControls.update();
  }

  function zoomOut(e) {
    e.preventDefault;
    orbitControls.dollyOut(1.1);
    orbitControls.update();
  }

  init();
}

/*
 * Context menu for selected item
 */ 

var ContextMenu = function(blueprint3d) {

  var scope = this;
  var selectedItem;
  var three = blueprint3d.three;

  function init() {

	 // handle item select state
    three.itemSelectedCallbacks.add(_itemSelected);
    three.itemUnselectedCallbacks.add(_itemUnselected);
    three.itemBeingDragged.add(function (dragging, mouse) {
    	var contextMenu = $("#context-menu");
    	if (dragging) {
    		contextMenu.hide();
    	} else {
    		contextMenu.css({
    			"left": (mouse.x - 70) + 'px',
    			"top": (mouse.y - 100) + 'px'
    		});
    		contextMenu.show();
    	}
    });

	 // handle delete item
    $("#context-menu-delete").click(function() {
		_deleteSelectedItemInRoom();
	 });

	 $(document).on('keydown', function(e) {
		 var key = e.keyCode || e.charCode;
		 if (key == 8 || key == 46) {
			 if (selectedItem) _deleteSelectedItemInRoom();
		 }
	 })

	 // handle fix item
	 var fixButton = $("#context-menu-fix");
    fixButton.click(function () {
		  var fixSelector = fixButton.children('i');
		  var fixState = fixSelector.attr('class').split('-')[1];
		  var toUnlock = fixState === 'lock';
		  // swtich lock state: if was fixed -> unlock, if !fixed -> lock
		  fixSelector.attr('class', `fas ${toUnlock ? "fa-unlock-alt" : "fa-lock"}`);
		  selectedItem.setFixed(!toUnlock);
	 });
	 
	 // handle item duplicate
	 $("#context-menu-copy").click(() => {
		 const {metadata} = selectedItem;
		 blueprint3d.model.scene.addItem(metadata.itemType, metadata.modelUrl, metadata);
		 addInRoomItem(metadata.itemName, metadata.thumbnail);
	 }); 
  }

  // helper functions
  function _cmToIn(cm) { return cm / 2.54; }
  function _inToCm(inches) { return inches * 2.54; }

  function _itemSelected(item, mouse) {
	 selectedItem = item;
	 
	 var contextMenu = $("#context-menu");
	 var initSelect = mouse === true;
	 var ctxOnShow = contextMenu.is(":visible") 
	 var sameItemClicked = contextMenu.attr('uuid') === item.uuid;

	 if (!initSelect && !(ctxOnShow && sameItemClicked)) {
		 contextMenu.attr('uuid', item.uuid);
		 contextMenu.css({"left": (mouse.x - 50) + 'px' , "top": (mouse.y - 150) + 'px'});
		 $("#context-menu-name").text(item.metadata.itemName);
		 contextMenu.show();
	 } else if (!sameItemClicked) {
		 contextMenu.hide();
	 }
	 
	 var fixButton = $("#context-menu-fix").children('i');
	 // set init fixed state
	 fixButton.attr('class', `fas ${item.fixed ? "fa-lock" : "fa-unlock-alt"}`);
  }

  function _itemUnselected() {
    selectedItem = null;
    $("#context-menu").hide();
  }

  function _deleteSelectedItemInRoom() {
  	var name = selectedItem.metadata.itemName;
  	var inRoomItem = $("#in-room-items").find('#' + name.split(' ').join('-'));
  	var curQty = Number(inRoomItem.find('.item-qty').text());
  	if (curQty === 1) {
  		inRoomItem.remove()
  	} else {
  		inRoomItem.find('.item-qty').text(curQty - 1);
  	}

  	selectedItem.delete();
  }

  init();
}

/*
 * Loading modal for items
 */

var ModalEffects = function(blueprint3d) {

  var scope = this;
  var blueprint3d = blueprint3d;
  var itemsLoading = 0;

  this.setActiveItem = function(active) {
    itemSelected = active;
    update();
  }

  function update() {
    if (itemsLoading > 0) {
      $("#loading-modal").show();
    } else {
      $("#loading-modal").hide();
    }
  }

  function init() {
    blueprint3d.model.scene.itemLoadingCallbacks.add(function() {
      itemsLoading += 1;
      update();
    });

     blueprint3d.model.scene.itemLoadedCallbacks.add(function() {
      itemsLoading -= 1;
      update();
    });   

    update();
  }

  init();
}

/*
 * Side menu
 */

var MainView = function(blueprint3d, floorplanControls, modalEffects) {
  var blueprint3d = blueprint3d;
  var floorplanControls = floorplanControls;
  var modalEffects = modalEffects;

  var ACTIVE_CLASS = "active";

  var tabs = {
    "FLOORPLAN" : $("#floorplan_tab"),
    "DESIGN" : $("#design_tab")
  }

  var scope = this;
  this.stateChangeCallbacks = $.Callbacks();

  this.states = {
    "DEFAULT" : {
      "div" : $("#viewer"),
      "tab" : tabs.DESIGN
    },
    "FLOORPLAN" : {
      "div" : $("#floorplanner"),
      "tab" : tabs.FLOORPLAN
    },
  }

  // sidebar state
  var currentState = scope.states.FLOORPLAN;

  function init() {
    for (var tab in tabs) {
      var elem = tabs[tab];
      elem.click(tabClicked(elem));
    }

    $("#update-floorplan").click(floorplanUpdate);

    initCtrlMenu();

    blueprint3d.three.updateWindowSize();
    handleWindowResize();

    initItems();

    setCurrentState(scope.states.DEFAULT);
  }

  function floorplanUpdate() {
    setCurrentState(scope.states.DEFAULT);
  }

  function tabClicked(tab) {
    return function() {
      // Stop three from spinning
      blueprint3d.three.stopSpin();

      // Selected a new tab
      for (var key in scope.states) {
        var state = scope.states[key];
        if (state.tab == tab) {
          setCurrentState(state);
          break;
        }
      }
    }
  }
  
  function setCurrentState(newState) {

    if (currentState == newState) {
      return;
    }

    // show the right tab as active
    if (currentState.tab !== newState.tab) {
      if (currentState.tab != null) {
        currentState.tab.removeClass(ACTIVE_CLASS);          
      }
      if (newState.tab != null) {
        newState.tab.addClass(ACTIVE_CLASS);
      }
    }

    // set item unselected
    blueprint3d.three.getController().setSelectedObject(null);

    // show and hide the right divs
    currentState.div.hide()
    newState.div.show()

    // custom actions
    if (newState == scope.states.FLOORPLAN) {
      floorplanControls.updateFloorplanView();
      floorplanControls.handleWindowResize();
    } 

    if (currentState == scope.states.FLOORPLAN) {
      blueprint3d.model.floorplan.update();
    }

    if (newState == scope.states.DEFAULT) {
      blueprint3d.three.updateWindowSize();
    }
 
    // set new state
    handleWindowResize();    
    currentState = newState;

    scope.stateChangeCallbacks.fire(newState);
  }

  function initCtrlMenu() {
    $( window ).resize( handleWindowResize );
    handleWindowResize();
  }

  function handleWindowResize() {
    $(".sidebar").height(window.innerHeight);
  };

  // TODO: this doesn't really belong here
  function initItems() {
    $("#add-items").find(".add-item").mousedown(function() {
      const metadata = {
        itemName: $(this).attr("model-name"),
		  modelUrl: $(this).attr("model-url"),
		  format: $(this).attr("model-format"),
		  itemType: parseInt($(this).attr("model-type")),
		  thumbnail: $(this).children('img').attr('src'),
		  resizable: false,
		}

		// if ($(this).attr("unit")) {
		// 	metadata.dimension = {
		// 		height: Number($(this).attr("height")),
		// 		width: Number($(this).attr("width")),
		// 		depth: Number($(this).attr("depth")),
		// 	};
		// 	metadata.resizable = true;
		// }

      blueprint3d.model.scene.addItem(metadata.itemType, metadata.modelUrl, metadata);
		addInRoomItem(metadata.itemName, metadata.thumbnail);
		
    });
  }

  init();

}


/*
 * Change floor and wall textures
 */

var TextureSelector = function (blueprint3d, mainView) {

  var scope = this;
  var three = blueprint3d.three;
  var isAdmin = isAdmin;

  var currentTarget = null;

  function initTextureSelectors() {
    $(".texture-select-thumbnail").click(function(e) {
      var textureUrl = $(this).attr("texture-url");
      var textureStretch = ($(this).attr("texture-stretch") == "true");
      var textureScale = parseInt($(this).attr("texture-scale"));
      currentTarget.setTexture(textureUrl, textureStretch, textureScale);

      e.preventDefault();
    });
  }

  function init() {
    three.wallClicked.add(wallClicked);
    three.floorClicked.add(floorClicked);
    three.itemSelectedCallbacks.add(reset);
    three.nothingClicked.add(reset);
	 mainView.stateChangeCallbacks.add(reset);
	 
	 $(".hide-texture-btn").click(() => reset());

    initTextureSelectors();
  }

  function wallClicked(halfEdge) {
    currentTarget = halfEdge;
    $("#floorTexturesDiv").hide();  
	 $("#wallTextures").show();
	 $("#item-list").css({"pointer-events": "none", "filter": "blur(5px)" });
  }

  function floorClicked(room) {
    currentTarget = room;
    $("#wallTextures").hide();  
	 $("#floorTexturesDiv").show();  
	 $("#item-list").css({"pointer-events": "none", "filter": "blur(5px)" });
  }

  function reset() {
    $("#wallTextures").hide();  
	 $("#floorTexturesDiv").hide();  
	 $("#item-list").css({"pointer-events": "unset", "filter": "none" });
  }

  init();
}

/*
 * Floorplanner controls
 */

var ViewerFloorplanner = function(blueprint3d) {

  var canvasWrapper = '#floorplanner';

  // buttons
  var move = '#move';
  var remove = '#delete';
  var draw = '#draw';

  var activeStlye = 'btn-primary disabled';

  this.floorplanner = blueprint3d.floorplanner;

  var scope = this;

  function init() {

    $( window ).resize( scope.handleWindowResize );
    scope.handleWindowResize();

    // mode buttons
    scope.floorplanner.modeResetCallbacks.add(function(mode) {
      $(draw).removeClass(activeStlye);
      $(remove).removeClass(activeStlye);
      $(move).removeClass(activeStlye);
      if (mode == BP3D.Floorplanner.floorplannerModes.MOVE) {
          $(move).addClass(activeStlye);
      } else if (mode == BP3D.Floorplanner.floorplannerModes.DRAW) {
          $(draw).addClass(activeStlye);
      } else if (mode == BP3D.Floorplanner.floorplannerModes.DELETE) {
          $(remove).addClass(activeStlye);
      }

      if (mode == BP3D.Floorplanner.floorplannerModes.DRAW) {
        $("#draw-walls-hint").show();
        scope.handleWindowResize();
      } else {
        $("#draw-walls-hint").hide();
      }
    });

    $(move).click(function(){
      scope.floorplanner.setMode(BP3D.Floorplanner.floorplannerModes.MOVE);
    });

    $(draw).click(function(){
      scope.floorplanner.setMode(BP3D.Floorplanner.floorplannerModes.DRAW);
    });

    $(remove).click(function(){
      scope.floorplanner.setMode(BP3D.Floorplanner.floorplannerModes.DELETE);
    });
  }

  this.updateFloorplanView = function() {
    scope.floorplanner.reset();
  }

  this.handleWindowResize = function() {
    $(canvasWrapper).height(window.innerHeight - $(canvasWrapper).offset().top);
    scope.floorplanner.resizeView();
  };

  init();
}; 

var mainControls = function(blueprint3d) {
  var blueprint3d = blueprint3d;

  function newDesign() {
	 blueprint3d.model.loadSerialized('{"floorplan":{"corners":{"f90da5e3-9e0e-eba7-173d-eb0b071e838e":{"x":204.85099999999989,"y":289.052},"da026c08-d76a-a944-8e7b-096b752da9ed":{"x":672.2109999999999,"y":289.052},"4e3d65cb-54c0-0681-28bf-bddcc7bdb571":{"x":672.2109999999999,"y":-178.308},"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2":{"x":204.85099999999989,"y":-178.308}},"walls":[{"corner1":"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2","corner2":"f90da5e3-9e0e-eba7-173d-eb0b071e838e","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"f90da5e3-9e0e-eba7-173d-eb0b071e838e","corner2":"da026c08-d76a-a944-8e7b-096b752da9ed","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"da026c08-d76a-a944-8e7b-096b752da9ed","corner2":"4e3d65cb-54c0-0681-28bf-bddcc7bdb571","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"4e3d65cb-54c0-0681-28bf-bddcc7bdb571","corner2":"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}}],"wallTextures":[],"floorTextures":{},"newFloorTextures":{}},"items":[]}');
	 $("#in-room-items").empty();
  }

  function loadDesign() {
	 files = $("#loadFile").get(0).files;
    var reader  = new FileReader();
    reader.onload = function(event) {
		  var data = event.target.result;
		  var json = JSON.parse(data);
		  // clear room items
		 	$("#in-room-items").empty();
		  for (var i = 0, len = json.items.length; i < len; i += 1) {
			  addInRoomItem(json.items[i].item_name, json.items[i].thumbnail);
		  }

		  console.log(data);
		  
        blueprint3d.model.loadSerialized(data);
    }
	 reader.readAsText(files[0]);
	 // clear cache
	 $("#loadFile")[0].value = '';
  }

  function saveDesign() {
    var data = blueprint3d.model.exportSerialized();
    var a = window.document.createElement('a');
    var blob = new Blob([data], {type : 'text'});
    a.href = window.URL.createObjectURL(blob);
    a.download = 'design.3dp';
    document.body.appendChild(a)
    a.click();
    document.body.removeChild(a)
  }

  function init() {
    $("#new").click(newDesign);
    $("#loadFile").change(loadDesign);
    $("#saveFile").click(saveDesign);
  }

  init();
}

/*
 * Initialize!
 */

$(document).ready(function() {

  // main setup
  var opts = {
    floorplannerElement: 'floorplanner-canvas',
    threeElement: '#viewer',
    threeCanvasElement: 'three-canvas',
    textureDir: "models/textures/",
    widget: false
  }
  var blueprint3d = new BP3D.Blueprint3d(opts);

  var modalEffects = new ModalEffects(blueprint3d);
  var viewerFloorplanner = new ViewerFloorplanner(blueprint3d);
  var contextMenu = new ContextMenu(blueprint3d);
  var mainView = new MainView(blueprint3d, viewerFloorplanner, modalEffects);
  var textureSelector = new TextureSelector(blueprint3d, mainView);        
  var cameraButtons = new CameraButtons(blueprint3d);
  mainControls(blueprint3d);

  // This serialization format needs work
  // Load a simple rectangle room
  blueprint3d.model.loadSerialized('{"floorplan":{"corners":{"f90da5e3-9e0e-eba7-173d-eb0b071e838e":{"x":204.85099999999989,"y":289.052},"da026c08-d76a-a944-8e7b-096b752da9ed":{"x":672.2109999999999,"y":289.052},"4e3d65cb-54c0-0681-28bf-bddcc7bdb571":{"x":672.2109999999999,"y":-178.308},"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2":{"x":204.85099999999989,"y":-178.308}},"walls":[{"corner1":"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2","corner2":"f90da5e3-9e0e-eba7-173d-eb0b071e838e","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"f90da5e3-9e0e-eba7-173d-eb0b071e838e","corner2":"da026c08-d76a-a944-8e7b-096b752da9ed","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"da026c08-d76a-a944-8e7b-096b752da9ed","corner2":"4e3d65cb-54c0-0681-28bf-bddcc7bdb571","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}},{"corner1":"4e3d65cb-54c0-0681-28bf-bddcc7bdb571","corner2":"71d4f128-ae80-3d58-9bd2-711c6ce6cdf2","frontTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0},"backTexture":{"url":"rooms/textures/wallmap.png","stretch":true,"scale":0}}],"wallTextures":[],"floorTextures":{},"newFloorTextures":{}},"items":[]}');
});
