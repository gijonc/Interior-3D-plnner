module BP3D.Items {
  /** Meta data for items. */
  export interface Metadata {
	 thumbnail: string;
    /** Name of the item. */
    itemName?: string;

    /** Type of the item. */
    itemType?: number;
    
    /** Url of the model. */
    modelUrl?: string;

    /** Resizeable or not */
	 resizable?: boolean;
	 
	 dimension?: {
		 depth: number,
		 width: number,
		 height: number,
		 unit: string,
	 };
  }
}