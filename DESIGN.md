---
name: TalaTrack
description: A clear workspace for teachers to review student attendance.
colors:
  ink: "#172033"
  ink-soft: "#344256"
  muted: "#68778b"
  line: "#e4e9f0"
  surface: "#ffffff"
  canvas: "#f6f8fb"
  brand: "#2563eb"
  brand-dark: "#1d4ed8"
  brand-pale: "#eff6ff"
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

# Design System: TalaTrack

## Overview

**Creative North Star: "The teacher's clear workspace"**

TalaTrack is a practical desktop workspace for teachers who need to understand class attendance quickly and follow up with students. It uses familiar school software patterns: a persistent task rail, a compact workspace header, summary values, trend views, and readable student tables. A restrained blue identity marks navigation and useful actions while white and light neutral surfaces keep records legible.

The system favors direct labels, compact but comfortable spacing, and status colors paired with letters or text. Data provenance stays clear, with a calm operational visual language that keeps student records in focus.

**Key Characteristics:**
- Teacher-first navigation and class context
- Light neutral canvas with blue actions
- Tables as the primary record surface
- Attendance states pair color with P, A, or L labels

## Colors

The palette uses blue for actions and analytics highlights, with light neutral surfaces and readable slate text.

### Primary
- **TalaTrack Blue**: Primary navigation and key actions.
- **Deep Blue**: Hover and stronger action states.

### Secondary
- **Warm Amber**: Late marks and attention cues.
- **Attendance Red**: Absence and high-risk indicators.

### Neutral
- **Deep Slate**: Headings and primary content.
- **Soft Deep Slate**: Supporting content.
- **Muted Slate**: Secondary labels.
- **Fine Divider**: Table and panel boundaries.
- **White Surface**: Panels and workspace header.
- **Light Neutral Canvas**: Application background.

## Typography

Manrope carries page and section headings. DM Sans handles body text, tables, controls, and supporting labels. Headings use a tight negative tracking; body copy uses open line spacing for scanability.

## Layout

The desktop shell uses a fixed-width left navigation rail and a fluid content region capped for comfortable reading. The top workspace bar remains compact. Page content uses responsive grids and summary bands; below 760px the rail becomes a drawer and content columns stack. Wide attendance tables scroll inside their own container.

## Elevation & Depth

Depth is mostly tonal: white surfaces sit on a very light neutral canvas and use thin borders. The sticky top bar uses a lightly translucent white fill. Shadows are reserved for the mobile navigation drawer.

## Shapes

Controls and navigation use gently rounded corners (8px). Panels use a slightly larger radius (12px). Attendance marks and small badges use tighter corners (6px). Dividers remain thin and low contrast.

## Components

Primary buttons use blue with white text; secondary buttons use white fill and a fine border. Panels align to a shared padding rhythm. Status marks use P, A, and L letters alongside distinct green, red, and amber fills. Tables use compact uppercase column labels and a soft row hover.

## Do's and Don'ts

- Do pair attendance color with a letter or text label.
- Do keep student tables readable and self-contained on narrow screens.
- Do label demo data and explain assumptions behind derived metrics.
- Don't use color alone to communicate attendance status.
- Don't use the demo names or metrics as real student records.
