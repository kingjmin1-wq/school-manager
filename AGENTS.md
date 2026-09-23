# Project Guidance

## User Preferences

- Khmer language interface
- Professional, information-dense admin layout
- Responsive design for desktop and mobile

## Verified Commands

- **typecheck**: `pnpm -r typecheck`
- **fix**: `pnpm -r fix`
- **build**: `pnpm -r build`

## Learnings

- Motoko 1.16.0 does not support triple-quoted multi-line text literals; use a single-line literal with \n escapes.
- caffeineai-oql MapEntity.toEntityManual takes two type parameters <K, V>; manual .payload requires top-level imports of the matching <Type>Value modules and RecordValue for auto-derived entities.
- mops check --fix reports 'too many pending migrations for check-limit=1' when more than one pending migration file exists; fold all changes into the single latest pending file.
- Generated bindings encode optional fields as candid_none() when undefined, so a Motoko ?T update field cannot be cleared from the UI without an explicit sentinel.
- Invalidating a plural query key (['students']) does not match singular detail keys (['student', id]); mutations that change derived counts must invalidate both.
- Guard BigInt() conversions of URL-derived ids and search params with try/catch; validateSearch that only checks typeof string still lets BigInt throw during render.
- TanStack Router search params must be declared in the route's validateSearch before useSearch typechecks.
- UserRole is a generated value enum in @/backend, not a string union.
- Wrapping every route component in a shared AdminGate satisfies 'management pages require sign-in' without per-page auth logic.
