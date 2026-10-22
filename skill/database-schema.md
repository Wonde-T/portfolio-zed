  Database Architecture (Prisma/PostgreSQL)
Below are the exact models required for the `schema.prisma` file. Generate the Prisma configurations based on this structure.

1. User (Admin)
- id: String (UUID, primary key)
- email: String (Unique)
- password_hash: String
- created_at: DateTime

2. SectionConfig (Global visibility toggles)
- id: String (UUID)
- section_name: String (Unique, e.g., "hero", "skills", "projects", "contact")
- is_visible: Boolean (Default: true)
- title: String (Optional, allows admin to rename sections)

3. Project (Portfolio case studies)
- id: String (UUID)
- title: String
- description: Text
- content_markdown: Text
- cloudinary_image_url: String
- github_url: String (Optional)
- live_url: String (Optional)
- category: String (e.g., "Full-Stack", "Frontend")
- is_visible: Boolean (Default: true)
- order_index: Int (For manual sorting)

4. Skill
- id: String (UUID)
- name: String
- category: String (e.g., "Frontend", "Backend", "Tools")
- is_visible: Boolean (Default: true)