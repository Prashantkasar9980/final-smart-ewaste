# Smart E-Waste Collection & Management – Backend

Spring Boot backend for the Smart E-Waste Collection & Management System.

Main endpoints:

- `POST /api/public/users/register` – user registration + document upload
- `POST /api/public/login` – user login (returns mustResetPassword flag)
- `POST /api/public/reset-password` – change password using temp password
- `POST /api/admin/login` – admin login (default Admin / Admin@123)
- `GET /api/admin/users` – list all users for dashboard
- `POST /api/admin/users/approve` – approve / reject & send credentials

Run with:

```bash
mvn spring-boot:run
```

Default DB is in-memory **H2**. Switch to MySQL by editing `application.properties`.