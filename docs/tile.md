# Tile

## Tiles are single-frame sprites used to create tiles for maps. These tiles are loaded from the `tile` node of a map. In particular, each map has 8 layers, represented by the nodes `0` through `7`. Each layer node in turn has a `tile` node and an `info` node. `info.tS` is used to determine which tile file is used, i.e. `Map.wz/Tile/${info.tS}.img`.

* x - The x coordinate to be placed on map.
* y - The y coordinate to be placed on map.
* zM -
* u - Used together with `no` to reference a tile sprite.
* no - The tile sprite is loaded from `Map.wz/Tile/${info.tS}.img/${u}/${no}`.
