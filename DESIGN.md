---
name: Attendwise
description: A clear workspace for teachers to review student attendance.
colors:
  ink: "#18251f"
  ink-soft: "#31443b"
  muted: "#738078"
  line: "#e4eae6"
  surface: "#ffffff"
  canvas: "#f5f7f6"
  brand: "#197353"
  brand-dark: "#125e43"
  brand-pale: "#e8f4ed"
  accent: "#bb6c28"
  danger: "#b94b46"
typography:
  display:
    fontFamily: "Manrope, Segoe UI, sans-serif"
    fontSize: "clamp(1.7rem, 2.5vw, 2.05rem)"
    fontWeight: 700
    lineHeight: 1.18
    letterSpacing: "-0.035em"
  body:
    fontFamily: "DM Sans, Segoe UI, sans-serif"
    fontSize: "0.94rem"
    fontWeight: 400
    lineHeight: 1.55
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.brand}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    height: "40px"
    padding: "0 14px"
  panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "22px"
---

# Design System: Attendwise

## Overview

**Creative North Star: "The teacher's clear workspace"**

Attendwise is a practical desktop workspace for teachers who need to understand class attendance quickly and follow up with students. It uses familiar school software patterns: a persistent task rail, a compact workspace header, summary values, trend views, and readable student tables. A restrained green identity marks navigation and useful actions while neutral surfaces keep records legible.

The system favors direct labels, compact but comfortable spacing, and status colors paired with letters or text. Imported data is visibly distinguished from the synthetic demo dataset. The visual language stays calm and operational so student records remain the focus.

**Key Characteristics:**
- Teacher-first navigation and class context
- Light neutral canvas with leaf-green actions
- Tables as the primary record surface
- Attendance states pair color with P, A, or L labels

## Colors

The palette combines a deep green action color with cool green-gray neutrals and restrained amber and red status accents.

### Primary
- **Leaf Green**: Primary navigation and key actions.
- **Deep Leaf**: Hover and stronger action states.

### Secondary
- **Warm Amber**: Late marks and attention cues.
- **Attendance Red**: Absence and high-risk indicators.

### Neutral
- **Forest Ink**: Headings and primary content.
- **Soft Forest Ink**: Supporting content.
- **Muted Green Gray**: Secondary labels.
- **Fine Divider**: Table and panel boundaries.
- **White Surface**: Panels and workspace header.
- **Cool Green Canvas**: Application background.

## Typography

Manrope carries page and section headings. DM Sans handles body text, tables, controls, and supporting labels. Headings use a tight negative tracking; body copy uses open line spacing for scanability.

## Layout

The desktop shell uses a fixed-width left navigation rail and a fluid content region capped for comfortable reading. The top workspace bar remains compact. Page content uses responsive grids and summary bands; below 760px the rail becomes a drawer and content columns stack. Wide attendance tables scroll inside their own container.

## Elevation & Depth

Depth is mostly tonal: white surfaces sit on a very light green-gray canvas and use thin borders. The sticky top bar uses a lightly translucent white fill. Shadows are reserved for the mobile navigation drawer.

## Shapes

Controls and navigation use gently rounded corners (8px). Panels use a slightly larger radius (12px). Attendance marks and small badges use tighter corners (6px). Dividers remain thin and low contrast.

## Components

Primary buttons use leaf green with white text; secondary buttons use white fill and a fine border. Panels align to a shared padding rhythm. Status marks use P, A, and L letters alongside distinct green, red, and amber fills. Tables use compact uppercase column labels and a soft row hover.

## Do's and Don'ts

- Do pair attendance color with a letter or text label.
- Do keep student tables readable and self-contained on narrow screens.
- Do label demo data and explain assumptions behind derived metrics.
- Don't use color alone to communicate attendance status.
- Don't use the demo names or metrics as real student records.
