# DineFlow Local Agent Charter (`projects/active/dineflow/AGENTS.md`)

## 1. Purpose
Governs the development lifecycle and coding quality policies of the DineFlow project. Enforces strict hexagonal layering, WCAG accessibility benchmarks, visual asset consistency, and thread safety.

## 2. Boundaries & Scope
- **Files Owned**: All files inside `/projects/active/dineflow/**`
- **External Dependencies**: Leverages standards defined in `architecture/` and shared configurations.
- **Never Modify**: Global workspace configurations outside of `projects/active/dineflow/` unless creating centralized ADRs under `architecture/adrs/`.

## 3. Engineering Quality Rules
- **Rule 1 (Hexagonal Separation)**: No Spring annotations (`@Service`, `@Repository`, `@Component`, `@Autowired`) or JPA annotations (`@Entity`, `@Table`, `@Column`, `@Id`, `@Version`) are permitted in the `domain/` packages. ArchUnit tests must enforce this rule.
- **Rule 2 (Double-Booking Prevention)**: All reservation bookings and table transitions must acquire fine-grained application/database locks to prevent concurrent race states.
- **Rule 3 (Database Integrity)**: No tables are created or modified outside Flyway migrations. All tables must feature the 4 audit columns: `created_at`, `updated_at`, `created_by`, and `version` (optimistic lock).
- **Rule 4 (Mobile-First Experience)**: QR table pages and customer menu navigation must achieve WCAG 2.1 AA accessibility and be optimized for mobile viewports.
- **Rule 5 (Visual Assets)**: Placeholder images are strictly prohibited in the final release. Every dish and interior representation must use high-quality, stylistically consistent generated assets.

## 4. Definition of Done
- Complete test coverage for Auth, Menu CRUD, Reservation, and Order state machines.
- Clean build for Next.js and Spring Boot.
- Real-time kitchen push updates validated with active SSE streams.
- Zero accessibility/contrast warnings on checkout and menu screens.
