// add items to the "Add Items" tab

$(document).ready(function() {
  var items = [
   {
      name : "Closed Door",
      image : "models/thumbnails/thumbnail_Screen_Shot_2014-10-27_at_8.04.12_PM.png",
      model : "models/js/closed-door28x80_baked.js",
		type : "7",
		format: "json"
    }, 
    {
      name : "Open Door",
      image : "models/thumbnails/thumbnail_Screen_Shot_2014-10-27_at_8.22.46_PM.png",
      model : "models/js/open_door.js",
		type : "7",
		format: "json"
    }, 
    {
      name : "Window",
      image : "models/thumbnails/thumbnail_window.png",
      model : "models/js/whitewindow.js",
		type : "3",
		format: "json"
    }, 
    {
      name : "Chair",
      image : "models/thumbnails/thumbnail_Church-Chair-oak-white_1024x1024.jpg",
      model : "models/js/gus-churchchair-whiteoak.js",
		type : "1",
		format: "json"
    }, 
    {
      name : "Red Chair",
      image : "models/thumbnails/thumbnail_tn-orange.png",
      model : "models/js/ik-ekero-orange_baked.js",
		type : "1",
		format: "json"
    },
    {
      name : "Blue Chair",
      image : "models/thumbnails/thumbnail_ekero-blue3.png",
      model : "models/js/ik-ekero-blue_baked.js",
		type : "1",
		format: "json"
    },
    {
      name : "Dresser - Dark Wood",
      image : "models/thumbnails/thumbnail_matera_dresser_5.png",
      model : "models/js/DWR_MATERA_DRESSER2.js",
		type : "1",
		format: "json"
    }, 
    {
      name : "Dresser - White",
      image : "models/thumbnails/thumbnail_img25o.jpg",
      model : "models/js/we-narrow6white_baked.js",
		type : "1",
		format: "json"
    },  
    {
      name : "Bedside table - Shale",
      image : "models/thumbnails/thumbnail_Blu-Dot-Shale-Bedside-Table.jpg",
      model : "models/js/bd-shalebedside-smoke_baked.js",
		type : "1",
		format: "json"
    }, 
    {
      name : "Bedside table - White",
      image : "models/thumbnails/thumbnail_arch-white-oval-nightstand.jpg",
      model : "models/js/cb-archnight-white_baked.js",
		type : "1",
		format: "json"
    }, 
    {
      name : "Wardrobe - White",
      image : "models/thumbnails/thumbnail_TN-ikea-kvikine.png",
      model : "models/js/ik-kivine_baked.js",
		type : "1",
		format: "json"
    }, 
    {
      name : "Full Bed",
      image : "models/thumbnails/thumbnail_nordli-bed-frame__0159270_PE315708_S4.JPG",
      model : "models/js/ik_nordli_full.js",
		type : "1",
		format: "json"
    }, 
    {
      name : "Bookshelf",
      image : "models/thumbnails/thumbnail_kendall-walnut-bookcase.jpg",
      model : "models/js/cb-kendallbookcasewalnut_baked.js",
		type : "1",
		format: "json"
    }, 
        {
      name : "Media Console - White",
      image : "models/thumbnails/thumbnail_clapboard-white-60-media-console-1.jpg",
      model : "models/js/cb-clapboard_baked.js",
		type : "1",
		format: "json"
    }, 
        {
      name : "Media Console - Black",
      image : "models/thumbnails/thumbnail_moore-60-media-console-1.jpg",
      model : "models/js/cb-moore_baked.js",
		type : "1",
		format: "json"
    }, 
       {
      name : "Sectional - Olive",
      image : "models/thumbnails/thumbnail_img21o.jpg",
      model : "models/js/we-crosby2piece-greenbaked.js",
		type : "1",
		format: "json"
    }, 
    {
      name : "Sofa - Grey",
      image : "models/thumbnails/thumbnail_rochelle-sofa-3.jpg",
      model : "models/js/cb-rochelle-gray_baked.js",
		type : "1",
		format: "json"
    }, 
        {
      name : "Wooden Trunk",
      image : "models/thumbnails/thumbnail_teca-storage-trunk.jpg",
      model : "models/js/cb-tecs_baked.js",
		type : "1",
		format: "json"
    }, 
        {
      name : "Floor Lamp",
      image : "models/thumbnails/thumbnail_ore-white.png",
      model : "models/js/ore-3legged-white_baked.js",
		type : "1",
		format: "json"
    },
    {
      name : "Coffee Table - Wood",
      image : "models/thumbnails/thumbnail_stockholm-coffee-table__0181245_PE332924_S4.JPG",
      model : "models/js/ik-stockholmcoffee-brown.js",
		type : "1",
		format: "json"
    }, 
    {
      name : "Side Table",
      image : "models/thumbnails/thumbnail_Screen_Shot_2014-02-21_at_1.24.58_PM.png",
      model : "models/js/GUSossingtonendtable.js",
		type : "1",
		format: "json"
    }, 
    {
      name : "Dining Table",
      image : "models/thumbnails/thumbnail_scholar-dining-table.jpg",
      model : "models/js/cb-scholartable_baked.js",
		type : "1",
		format: "json"
    }, 
    {
      name : "Dining table",
      image : "models/thumbnails/thumbnail_Screen_Shot_2014-01-28_at_6.49.33_PM.png",
      model : "models/js/BlakeAvenuejoshuatreecheftable.js",
		type : "1",
		format: "json"
    },
    {
      name : "Blue Rug",
      image : "models/thumbnails/thumbnail_cb-blue-block60x96.png",
      model : "models/js/cb-blue-block-60x96.js",
		type : "8",
		format: "json"
    },
    {
      name : "NYC Poster",
      image : "models/thumbnails/thumbnail_nyc2.jpg",
      model : "models/js/nyc-poster2.js",
      type : "2",
      format: "json"
	 },
    {
      name : "Arm Chair",
      image : "models/thumbnails/armchair.jpg",
      model : "models/js/armchair.json",
      type : "1",
      format: "json"
    },
    {
      name : "Sofa",
      image : "models/thumbnails/sofa.jpg",
      model : "models/js/sofa.json",
      type : "1",
      format: "json"
    },
    {
      name : "Wooden Table",
      image : "models/thumbnails/wooden_table.jpg",
      model : "models/js/wooden_table.json",
      type : "1",
      format: "json"
    },
	 // following are gltf format models
	 {
		name: "arm chair",
		image: "models/thumbnails/thumbnail_armchair.jpg",
		model: "models/gltf/armchair/armchair.gltf",
		type: "1",
		format: "gltf",
	 },
	 {
	 	name: "wooden table",
	 	image: "models/thumbnails/thumbnail_wooden_table.jpg",
	 	model: "models/gltf/wooden_table/wooden_table.gltf",
	 	type: "1",
		format: "gltf",
	 },
	 {
	 	name: "sofa gltf",
	 	image: "models/thumbnails/thumbnail_sofa.jpg",
	 	model: "models/gltf/sofa/sofa.gltf",
	 	type: "1",
		format: "gltf",
	 },
  ];

  /**	modeltype mapping index
	* 
		1 => floor-items
		2 => wall-items
		3 => in-wall-items
		7 => in-wall-floor-items
		8 => on-floor-items
		9 => wall-floor-items
	*/

  var itemsDiv = $("#added-items-container")
  
  for (var i = 0; i < items.length; i++) {
	 var item = items[i];
    var html = 
				`<div 
					class="img-thumbnail add-item" 
					model-name="${item.name}"
					model-url="${item.model}"
					model-type="${item.type}"
					model-format="${item.format}"
					${item.dimension ? Object.keys(item.dimension).map(key =>
						`${key}="${item.dimension[key]}"`
					).join(' ') : ''}
				 >
					<img src="${item.image}" alt="${item.name}" />
					<span>${item.name}</span>
				</div>`;
    itemsDiv.append(html);
  }
});