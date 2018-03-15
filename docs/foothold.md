# Foothold

## Footholds are lines which are used to create walls and floors in maps. Each of these lines is represented by two points. Additionally, every foothold has two pointers, `prev` and `next`. The pointers may be 0, which implies null, or the ID of another foothold.

## Footholds are loaded from the `foothold` node of map nodes. The first level of the `foothold` node is an integer 0-7 specifying the layer to which its children foothold belong. The second layer is a unique integer specifying the group to which its children foothold belong. Finally, the third layer is a unique integer which identifies each foothold. The ID starts from 1, allowing 0 to be used as the null value.

* id - The ID of the foothold.
* group - The group to which the foothold belongs.
* layer - The layer to which the foothold belongs.
* x1
* y1
* x2
* y2
* prev - A reference to the foothold on the left. If prev is a left wall of the same group, negative horizontal movement will be stopped.
* next - A reference to the foothold on the right. If next is a right wall of the same group, positive horizontal movement will be stopped.
* force=0
* forbidFallDown=0
* isWall - Indicates if this foothold is a wall.
* slope -
* isCeiling - Indicates if this foothold is a ceiling. Ceilings won't stop positive vertical movement, but will stop negative vertical movement if a player tries to jump above it coming from a foothold of the same group.
