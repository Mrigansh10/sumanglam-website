import reviewsCache from "@/data/google-reviews.json";

export type GoogleReview = {
  authorName: string;
  rating: number;
  text: string;
  relativeTime: string;
  profilePhotoUrl?: string;
};

export type GooglePlaceData = {
  rating: number;
  userRatingsTotal: number;
  reviews: GoogleReview[];
};

export async function getGoogleReviews(): Promise<GooglePlaceData | null> {
  const { rating, userRatingsTotal, reviews } = reviewsCache as GooglePlaceData & {
    lastScraped: string | null;
  };

  if (!reviews || reviews.length === 0) return null;

  return { rating, userRatingsTotal, reviews };
}
