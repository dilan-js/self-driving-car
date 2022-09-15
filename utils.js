// Linear Interpolation function to create lanes
// Gets values between left (A) and right (B) by a % (t)
// t will always be between 0-1
const lerp = (A, B, t) => A + (B - A) * t;
