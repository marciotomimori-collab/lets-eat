export interface Review {
  id: string;
  userId: string;
  userDisplayName: string;
  userPhotoURL?: string;
  placeId: string;
  placeName: string;
  rating: number;
  comment: string;
  eventType: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewInput {
  placeId: string;
  placeName: string;
  rating: number;
  comment: string;
  eventType?: string;
}
