# Map

* info - Metadata about the map.
    * version
    * cloud
    * town - 1 if the map is a town, 0 otherwise.
    * returnMap - ID of return map.
    * forcedReturn
    * mobRate
    * bgm - Name of BGM.
    * mapMark
    * [VRLeft] - If this value is present, then the boundaries of the map are determined by `VRLeft`, `VRTop`, `VRBottom`, and `VRRight`. Otherwise, the boundaries of the map are calculated using its footholds. In particular, if `VRLeft` exists, then the boundaries are {`left`: `VRLeft`, `right`: `VRRight`, `top`: `VRTop`, `bottom`: `VRBottom`}. If not, then they are {`left`: `min foothold x value + 10`, `right`: `max foothold x value - 10`, `top`: `min foothold y value - 360`, `bottom`: `max foothold y value + 110`}. See map 230010200, where all boundaries are touched by the camera in the official client.
    * [VRTop]
    * [VRBottom]
    * [VRRight]
* back
    * ^[0-9]* - ID. The ID is also used as a z index, sorted in ascending order. Example: toggle sorting for map 600000000 to see why the backgrounds should be sorted by ID.
        * bS - Which background file. If this value is falsey, no background is loaded.
        * no - Background sprite number, used in conjunction with `ani`. If ani is 0, the background is loaded from `Map.wz/Back/${bS}.img/back/${no}`. Otherwise, it is loaded from `Map.wz/Back/${bS}.img/ani/${no}`.
        * x - X coordinate.
        * y - Y coordinate.
        * rx - Horizontal velocity. Used for either parallax or movement, depending on `type`.
        * ry - Vertical velocity. Used for either parallax or movement, depending on `type`.
        * type - A flag that determines how the background is rendered. If vertical tiling and `cy` is 0, then the height of the image is used to separate the tiles. Otherwise, `cy` is used. If horizontal tiling and `cx` is 0, then the width of the image is used to separate the tiles. Otherwise, `cx` is used.
            * 0 - No tiling. Use `rx` and `ry` for parallax.
            * 1 - Vertical tiling. Use `rx` and `ry` for parallax.
            * 2 - Horizontal tiling. Use `rx` and `ry` for parallax.
            * 3 - Both vertical and horizontal tiling. Use `rx` and `ry` for parallax.
            * 4 - Vertical tiling. Use `rx` along with timestamp for moving and `ry` for parallax.
            * 5 - Horizontal tiling. Use `ry` along with timestamp for moving and `rx` for parallax.
            * 6 - Both vertical and horizontal tiling. Use `rx` along with timestamp for moving and `ry` for parallax.
            * 7 - Both vertical and horizontal tiling. Use `ry` along with timestamp for moving and `rx` for parallax.
        * cx - Tiling width.
        * cy - Tiling height.
        * a - Alpha.
        * [front] - 1 if the background is a foreground (rendered in front), 0 otherwise (rendered in back).
        * [ani=0] - 1 if animated, 0 otherwise. If the background is animated, it has more than 1 frame.
        * [f] - 1 if the background is mirrored about the x axis, 0 otherwise.
* life - List of NPCs and monsters.
    * ^[0-9]* - ID.
        * type - `n` for NPC, `m` for monster. This value must be either `n` or `m`.
        * id - Load from `Npc.wz/${id}` if NPC, `Mob.wz/${id}` if monster.
        * x - X coordinate to be placed.
        * y -
        * cy - Y coordinate touching a foothold.
        * rx0 -
        * rx1 -
        * [mobTime] -
        * [f=0] - 1 if the object is flipped
        * [hide]
        * [limitedname] - For NPCs only.
        * [info] - For NPCs only.
        * [team] - For monsters only.
* foothold - Footholds are used to create walls and floors in maps. Each foothold is a line represented by two points. Additionally, it has two pointers, `prev` and `next`. These pointers may be 0, which implies null, or the ID of another foothold.
    * [0-7] - Layer, the layer number to which the foothold belongs.
        * ^[0-9]* - Group.
            * ^[0-9]* - ID, starting at 1.
                * x1 - X coordinate of first point.
                * y1 - Y coordinate of first point.
                * x2 - X coordinate of second point.
                * y2 - Y coordinate of second point.
                * prev - ID of previous foothold.
                * next - ID of next foothold.
                * [force] - Horizontal speed, acting as a conveyor belt.
                * [forbidFallDown] - 1 if forbid, 0 otherwise.
* ladderRope - The ladderRope node determines the ladders and ropes in the map. Every ladder and rope is represented by a vertical line.
    * ^[0-9]* - ID.
        * l - 1 is ladder, 0 is rope.
        * uf -
        * x - X coordinate.
        * y1 - Y coordinate 1.
        * y2 - Y coordinate 2.
        * page -
* portal
* 0 - The bottommost layer.
    * info
    * tile
    * obj
* 1
    * info
    * tile
    * obj
* 2
    * info
    * tile
    * obj
* 3
    * info
    * tile
    * obj
* 4
    * info
    * tile
    * obj
* 5
    * info
    * tile
    * obj
* 6
    * info
    * tile
    * obj
* 7 - The topmost layer.
    * info
    * tile
    * obj
* [seat] - Seats. The official client loads map seats from this node rather than from the `seat` property of Objs.
