export default interface GameEvent {
    type: string;
    data?: {
        tile_id: number;
        completed: boolean;
    };
}
