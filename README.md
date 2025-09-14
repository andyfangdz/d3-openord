# Pilot Power Curve Explorer

An interactive single-page app to help pilots understand drag, power required/available, and how altitude and power affect Vx, Vy, and Vg.

## Quick start

Open `index.html` in a browser. No build step; everything is static.

## What it models

- Induced and parasite drag as a function of indicated airspeed using simple aerodynamic relations:
  - Parasite: Dp = 0.5·ρ0·Vias²·S·CD0
  - Induced: Di = (W²)/(π·e·AR·qias·S)
  - Total: D = Dp + Di
- Power required: Pr = D · Vtrue (displayed in kW)
- Power available (propeller aircraft): Pa = (engine_kW · throttle · model(alt)) · ηp
  - Normally aspirated: model(alt) = σ = ρ/ρ0
  - Constant: model(alt) = 1 (e.g., turbo/electric within limits)
- Thrust available: Ta = Pa / Vtrue

Assumptions: ISA standard day; steady, level flight for drag curve; propeller aircraft; no compressibility or Mach effects; educational purposes only.

## Key speeds

- Vg (best glide): IAS where total drag is minimum (max L/D)
- Vx (best angle): IAS where thrust excess (Ta − D) is maximum (max climb angle)
- Vy (best rate): IAS where power excess (Pa − Pr) is maximum (max rate of climb)

Altitude effects (conceptual, in IAS terms):

- Drag curve vs IAS is largely unchanged with altitude (same weight/configuration)
- Power available typically decreases with altitude (NA engines)
- Power required increases for the same IAS because Vtrue = Vias / √σ
- Vy moves toward Vg; climb performance degrades; Vx trends toward Vg

## Default parameters (C172-ish)

- Mass: 1043 kg (≈ 2300 lb)
- Wing area: 16.2 m²
- Aspect ratio: 7.3
- Oswald efficiency: 0.80
- CD0: 0.030
- Engine power at SL: 134 kW (≈ 180 hp)
- Prop efficiency: 0.80

## Notes

- Units on x-axis are KIAS. Metrics display speeds in knots, climb rate in fpm, angle in degrees.
- If throttle is low or altitude is high enough that Pa < Pr everywhere, Vy is still shown at the Pr minimum but max ROC will be 0 fpm.
- This is a simplified model for learning. Do not use for real-world flight planning.

 Deprecated. Moved to https://github.com/andyfangdz/OpenOrd.js
