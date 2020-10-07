/// <reference path="../core/utils.ts" />
/// <reference path="../items/factory.ts" />

module BP3D.Model {
  /**
   * The Scene is a manager of Items and also links to a ThreeJS scene.
   */
  export class Scene {

    /** The associated ThreeJS scene. */
    private scene: THREE.Scene;

    /** */
    private items: Items.Item[] = [];

    /** */
    public needsUpdate = false;

    /** model loaders. */
	 private jsonLoader: THREE.JSONLoader;
	 private gltfLoader: THREE.GLTFLoader;

    private textureLoader: THREE.TextureLoader;

    /** */
    private itemLoadingCallbacks = $.Callbacks();

    /** Item */
    private itemLoadedCallbacks = $.Callbacks();

    /** Item */
    private itemRemovedCallbacks = $.Callbacks();

    /**
     * Constructs a scene.
     * @param model The associated model.
     * @param textureDir The directory from which to load the textures.
     */
    constructor(private model: Model, private textureDir: string) {
      this.scene = new THREE.Scene();

      // init item loader
		 this.jsonLoader = new THREE.JSONLoader();
		 this.jsonLoader.crossOrigin = '';

		 this.gltfLoader = new THREE.GLTFLoader();
		//  this.gltfLoader.setCrossOrigin('');

      //init texture loader
      this.textureLoader = new THREE.TextureLoader();
      this.textureLoader.setCrossOrigin("");

    }

    /** Adds a non-item, basically a mesh, to the scene.
     * @param mesh The mesh to be added.
     */
    public add(mesh: THREE.Mesh) {
      this.scene.add(mesh);
    }

    /** Removes a non-item, basically a mesh, from the scene.
     * @param mesh The mesh to be removed.
     */
    public remove(mesh: THREE.Mesh) {
      this.scene.remove(mesh);
      Core.Utils.removeValue(this.items, mesh);
    }

    /** Gets the scene.
     * @returns The scene.
     */
    public getScene(): THREE.Scene {
      return this.scene;
    }

    /** Gets the items.
     * @returns The items.
     */
    public getItems(): Items.Item[] {
      return this.items;
    }

    /** Gets the count of items.
     * @returns The count.
     */
    public itemCount(): number {
      return this.items.length
    }

    /** Removes all items. */
    public clearItems() {
      var items_copy = this.items
      var scope = this;
      this.items.forEach((item) => {
        scope.removeItem(item, true);
      });
      this.items = []
    }

    /**
     * Removes an item.
     * @param item The item to be removed.
     * @param dontRemove If not set, also remove the item from the items list.
     */
    public removeItem(item: Items.Item, dontRemove?: boolean) {
      dontRemove = dontRemove || false;
      // use this for item meshes
      this.itemRemovedCallbacks.fire(item);
      item.removed();
      this.scene.remove(item);
      if (!dontRemove) {
        Core.Utils.removeValue(this.items, item);
      }
    }

    /**
     * Creates an item and adds it to the scene.
     * @param itemType The type of the item given by an enumerator.
     * @param fileName The name of the file to load.
     * @param metadata TODO
     * @param position The initial position.
     * @param rotation The initial rotation around the y axis.
     * @param scale The initial scaling.
     * @param fixed True if fixed.
     */
    public addItem(itemType: number, fileName: string, metadata, position: THREE.Vector3, rotation: number, scale: THREE.Vector3, fixed: boolean) {
      itemType = itemType || 1;
		var scope = this;

		function addToMaterials(materials, newmaterial) {
			const { length } = materials;
			for (var i = 0; i < length; i++) {
				var mat = materials[i];
				if (mat.name == newmaterial.name) {
					return [materials, i];
				}
			}
			materials.push(newmaterial);
			return [materials, length - 1];
		}
		
      var loaderCallback = function (geometry: THREE.Geometry, materials: THREE.Material[]) {
        var item = new (Items.Factory.getClass(itemType))(
          scope.model,
			 metadata, 
			 geometry,
          materials,
			 position, 
			 rotation, 
			 scale
		  );

        item.fixed = fixed || false;
        scope.items.push(item);
        scope.add(item);
		  item.initObject();
		  
		  scope.itemLoadedCallbacks.fire(item);
		}
		
		var gltfCallback = function(gltfModel) {

			var newmaterials = [];
			var newGeometry = new THREE.Geometry();
			
			gltfModel.scene.traverse(function (child) {
				if(child.type == 'Mesh') {
					var materialindices = [];
					if(child.material.length) {
						for (var k=0;k<child.material.length;k++)
						{
							var newItems = addToMaterials(newmaterials, child.material[k]);
							newmaterials = newItems[0];
							materialindices.push(newItems[1]);
						}
					} else {
						newItems = addToMaterials(newmaterials, child.material);//materials.push(child.material);
						newmaterials = newItems[0];
						materialindices.push(newItems[1]);
					}
					
					if(child.geometry.isBufferGeometry) {
						var tGeometry = new THREE.Geometry().fromBufferGeometry(child.geometry);
						tGeometry.faces.forEach( face => {
//							face.materialIndex = face.materialIndex + newmaterials.length;
							face.materialIndex = materialindices[face.materialIndex];
						});
						child.updateMatrix();						
						newGeometry.merge(tGeometry, child.matrix);
					} else {
						child.geometry.faces.forEach( face => {
//							face.materialIndex = face.materialIndex + newmaterials.length;
							face.materialIndex = materialindices[face.materialIndex];
						});
						child.updateMatrix();
						newGeometry.mergeMesh(child);
					}
				}
			});

			loaderCallback(newGeometry, newmaterials);
		}; 

		this.itemLoadingCallbacks.fire();
		
		// TODO: handle loading progress and error
		if (metadata.format === 'gltf') {
			this.gltfLoader.load(fileName, gltfCallback, null, null);
		} else {
			this.jsonLoader.load(fileName, loaderCallback, undefined);
		}
    }
  }
}
