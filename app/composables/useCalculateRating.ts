// Calculation of the fill of rating stars that takes gaps into account
export const useCalculateRating = (rating: number) => {
  const starWidth = 19.6; // Each star takes up 18.75% of the total width
  const gapWidth = 0.5; // Each gap is 1.25% of the total width

  // Calculate how many full stars we have
  const fullStars = Math.floor(rating);

  // Calculate the percentage of the last partially filled star
  const partialStar = rating - fullStars;

  // Calculate the total width including gaps up to the current rating
  let totalWidth = (fullStars * starWidth) + (fullStars * gapWidth);

  // Add the partial star width if there is one, but don't add an extra gap after the partial star
  if (partialStar > 0) {
    totalWidth += (partialStar * starWidth);
  }

  // Remove the last gap if we've filled all stars
  if (rating === 5) {
    totalWidth -= gapWidth;
  }

  // Ensure we don't exceed 100%
  totalWidth = Math.min(totalWidth, 100);

  return `${totalWidth}%`;
};