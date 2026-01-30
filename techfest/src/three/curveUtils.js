import * as THREE from "three"

export const buildRoadCurve = (profile = "STRAIGHT") => {
  if (profile === "TURN") {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -40),
      new THREE.Vector3(10, 0, -80),
      new THREE.Vector3(20, 0, -140)
    ])
  }

  if (profile === "POST_TURN") {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(20, 0, -140),
      new THREE.Vector3(20, 0, -200),
      new THREE.Vector3(20, 0, -260),
      new THREE.Vector3(20, 0, -320)
    ])
  }

  return new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, -80),
    new THREE.Vector3(0, 0, -160),
    new THREE.Vector3(0, 0, -240)
  ])
}
