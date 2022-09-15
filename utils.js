// Linear Interpolation function to create lanes
// Gets values between left (A) and right (B) by a % (t)
// t will always be between 0-1

function lerp(A, B, t) {
  return A + (B - A) * t;
}

function getIntersection(A, B, C, D) {
  const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

  if (bottom != 0) {
    const t = tTop / bottom;
    const u = uTop / bottom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: lerp(A.x, B.x, t),
        y: lerp(A.y, B.y, t),
        offset: t,
      };
    }
  }

  return null;
}

//takes two polygons as parameters and determines if they intersect
function polygonsIntersect(polygon1, polygon2) {
  for (let i = 0; i < polygon1.length; i++) {
    for (let j = 0; j < polygon2.length; j++) {
      //taking one point in first polygon and next point in first polygon
      //I'm making segments one point after another
      //modulo prevents issues when i = polygon1.length-1 --> adding 1 would go over array
      //in this case, modulo value would be 0, which causes last point in poly
      //to connect to last point.
      const touch = getIntersection(
        polygon1[i],
        polygon1[(i + 1) % polygon1.length],
        polygon2[j],
        polygon2[(j + 1) % polygon2.length]
      );
      if (touch) {
        return true;
      }
    }
  }
  return false;
}
