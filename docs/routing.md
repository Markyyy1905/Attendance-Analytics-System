# Routes

The application route tree lives in `src/app/App.tsx`; every feature page renders inside `AppShell`.

| Route | Screen |
| --- | --- |
| `/dashboard` | Class overview and students to review |
| `/classes` | Class workspace and class switching |
| `/staff` | Administrator staff accounts and class assignments |
| `/attendance` | Searchable attendance matrix by class date |
| `/students` | Student roster and risk status |
| `/students/:studentId` | Individual attendance profile and history |
| `/analytics` | Class attendance trends and status totals |
| `/import` | CSV selection, validation, preview, and apply |

Unknown routes return to `/dashboard`. Add new routes under their feature folder and keep the shared shell in `components/layout`.
