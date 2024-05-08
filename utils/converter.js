export function roundToNearestFiveOrZero(number) {
  // Separate the integer and fractional parts
  var integerPart = Math.floor(number);
  var fractionalPart = number - integerPart;

  // Round the fractional part to the nearest 0.05
  var roundedFractionalPart = Math.round(fractionalPart * 20) / 20;

  // If the rounded fractional part is 1, adjust the integer part accordingly
  if (roundedFractionalPart === 1) {
    integerPart += 1;
    roundedFractionalPart = 0;
  }

  // Combine the integer and rounded fractional parts
  var result = integerPart + roundedFractionalPart;

  return Number(result.toFixed(2)); // Convert back to string with two decimal places
}
