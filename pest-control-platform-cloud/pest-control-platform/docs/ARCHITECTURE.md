# Architecture Notes

## Data flow

USER -> AUTH -> PERMISSION -> CUSTOMER -> TASK -> SCHEDULE -> TRAVEL/GPS -> CHECK-IN -> WORK -> SERVICE REPORT -> CHECK-OUT -> REPORTING

## Permission security

Frontend permissions only control presentation. API endpoints use authentication and permission guards. Role permissions are combined with explicit user permission overrides; an explicit deny wins.

## GPS

The target interval is configurable and defaults to 4 seconds on the client when an active browser watch is available. Browser/OS limitations can pause background execution. The system stores last-seen timestamps so the UI can distinguish current, stale, and offline users instead of fabricating online status.

## Geofence

Customer records store latitude, longitude, and a configurable radius. Check-in validates the reported point using a Haversine distance calculation. PostGIS is available in the database image for future spatial query expansion.

## Service Report

The reference PDF is preserved under `docs/reference`. The digital schema separates report header, pest findings, treatments, photos, and signatures so monthly analytics can query findings independently.
