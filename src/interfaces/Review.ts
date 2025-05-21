interface IReview {
    id?: number; // opcional si es para insert
    userId: number;
    restaurantId: number;
    title: string;
    description: string;
    suitable: boolean | null;
    createdAt: Date;
    updatedAt: Date;
}