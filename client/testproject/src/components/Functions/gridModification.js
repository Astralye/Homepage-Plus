export class GridModificationClass {
    // Assuming iconSize is a square
    static calculateGridDimension(width, height, iconSize){ return { rows: ~~(width / iconSize), columns: ~~(height / iconSize) };}
}