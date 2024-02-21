# Comments System

This application is powerful and scalable REST API for commenting.

Check out **Swagger Documentation**: https://comments-system-zlpi.onrender.com/api

**Tech Stack**:
- NestJS
- PostgreSQL
- Prisma ORM
- JWT
- Passport.js
- Docker
- Swagger

## How to set up it locally?

Firstly, clone this repo:

```bash
git clone https://github.com/fokaaas/comments-system.git
```

Then install **pnpm** globally:

```bash
npm install -g pnpm
```

Install dependencies in project directory:

```bash
pnpm install
```

Create .env file with environment variables, that has this structure:

```dotenv
DATABASE_URL=
PORT=

SMTP_HOST=
SMTP_USERNAME=
SMTP_PASSWORD=

SECRET=
ACCESS_TTL=
REFRESH_TTL=

FRONT_BASE_URL=
```

Apply schema to your database:

```bash
pnpm dlx prisma generate
```

Run application:

```bash
pnpm start:dev
```

## Database Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum State {
  PENDING
  APPROVED
  DECLINED
}

enum TokenType {
  EMAIL
  PASSWORD
  REFRESH
}

enum FileType {
  PICTURE
  TXT
}

model User {
  id                  String         @id @default(uuid())
  username            String         @unique
  email               String         @unique
  password            String
  avatar              String
  state               State          @default(PENDING)
  homepage            String?
  lastPasswordUpdated DateTime       @default(now()) @map("last_password_updated")
  createdAt           DateTime       @default(now()) @map("created_at")
  tokens              Token[]
  comments            Comment[]
  savedComments       SavedComment[]

  @@map("users")
}

model Token {
  value     String    @unique
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId    String    @map("user_id")
  type      TokenType
  createdAt DateTime  @default(now()) @map("created_at")

  @@map("tokens")
}

model Comment {
  id        String         @id @default(uuid())
  user      User?          @relation(fields: [userId], references: [id], onDelete: SetNull)
  userId    String?        @map("user_id")
  parentId  String?        @map("parent_id")
  parent    Comment?       @relation("CommentRelation", fields: [parentId], references: [id], onDelete: Cascade)
  responses Comment[]      @relation("CommentRelation")
  text      String
  createdAt DateTime       @default(now()) @map("created_at")
  saves     SavedComment[]
  files     File[]

  @@map("comments")
}

model File {
  id        String   @id @default(uuid())
  link      String
  type      FileType
  comment   Comment  @relation(fields: [commentId], references: [id], onDelete: Cascade)
  commentId String   @map("comment_id")

  @@map("files")
}

model SavedComment {
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId    String   @map("user_id")
  comment   Comment  @relation(fields: [commentId], references: [id], onDelete: Cascade)
  commentId String   @map("comment_id")
  createdAt DateTime @default(now()) @map("created_at")

  @@id([userId, commentId])
  @@map("saved_comments")
}
```

## Auth Model

## File Saving & Storing

All files are stored locally on the server using a hash in their name. A certain type of file has its own static folders.

**static/images** for images and **static/txt** for txt files

You can then access these files by following the link. (ex: http://127.0.0.1/images/name.png or http://127.0.0.1/txt/name.png)

But currently the **current host doesn't support it** because it's free.

## Dockerization

Check out **Dockerfile** to create image.
Also project have **github workflows**.