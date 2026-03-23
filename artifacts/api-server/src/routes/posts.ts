import { Router, type IRouter } from "express";
import { db, postsTable, commentsTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";
import {
  CreatePostBody,
  CreateCommentBody,
  ListPostsQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/posts", async (req, res) => {
  try {
    const query = ListPostsQueryParams.safeParse(req.query);
    const category = query.success ? query.data.category : undefined;
    const sort = query.success ? query.data.sort : undefined;

    let dbQuery = db.select().from(postsTable);

    const results = await dbQuery;

    let filtered = category
      ? results.filter((p) => p.category === category)
      : results;

    if (sort === "most_liked") {
      filtered.sort((a, b) => b.likeCount - a.likeCount);
    } else {
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }

    const mapped = filtered.map((p) => ({
      id: p.id,
      title: p.title,
      content: p.content,
      category: p.category,
      likeCount: p.likeCount,
      commentCount: p.commentCount,
      createdAt: p.createdAt.toISOString(),
    }));

    res.json(mapped);
  } catch (err) {
    req.log.error({ err }, "Failed to list posts");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/posts", async (req, res) => {
  try {
    const parsed = CreatePostBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }

    const [post] = await db
      .insert(postsTable)
      .values({
        title: parsed.data.title,
        content: parsed.data.content,
        category: parsed.data.category,
      })
      .returning();

    res.status(201).json({
      id: post.id,
      title: post.title,
      content: post.content,
      category: post.category,
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      createdAt: post.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create post");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/posts/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    const [post] = await db
      .select()
      .from(postsTable)
      .where(eq(postsTable.id, id));

    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    const comments = await db
      .select()
      .from(commentsTable)
      .where(eq(commentsTable.postId, id))
      .orderBy(desc(commentsTable.createdAt));

    res.json({
      id: post.id,
      title: post.title,
      content: post.content,
      category: post.category,
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      createdAt: post.createdAt.toISOString(),
      comments: comments.map((c) => ({
        id: c.id,
        postId: c.postId,
        content: c.content,
        createdAt: c.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get post");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/posts/:id/like", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    const [post] = await db
      .update(postsTable)
      .set({ likeCount: sql`${postsTable.likeCount} + 1` })
      .where(eq(postsTable.id, id))
      .returning();

    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    res.json({
      id: post.id,
      title: post.title,
      content: post.content,
      category: post.category,
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      createdAt: post.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to like post");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/posts/:id/comments", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    const parsed = CreateCommentBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }

    const [post] = await db
      .select()
      .from(postsTable)
      .where(eq(postsTable.id, id));

    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    const [comment] = await db
      .insert(commentsTable)
      .values({ postId: id, content: parsed.data.content })
      .returning();

    await db
      .update(postsTable)
      .set({ commentCount: sql`${postsTable.commentCount} + 1` })
      .where(eq(postsTable.id, id));

    res.status(201).json({
      id: comment.id,
      postId: comment.postId,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create comment");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/stats", async (req, res) => {
  try {
    const allPosts = await db
      .select()
      .from(postsTable)
      .orderBy(desc(postsTable.createdAt));

    const totalPosts = allPosts.length;

    const categoryCounts: Record<string, number> = {};
    for (const post of allPosts) {
      categoryCounts[post.category] = (categoryCounts[post.category] || 0) + 1;
    }

    const postsByCategory = Object.entries(categoryCounts).map(
      ([category, count]) => ({ category, count }),
    );

    const mostLikedPosts = [...allPosts]
      .sort((a, b) => b.likeCount - a.likeCount)
      .slice(0, 5)
      .map((p) => ({
        id: p.id,
        title: p.title,
        content: p.content,
        category: p.category,
        likeCount: p.likeCount,
        commentCount: p.commentCount,
        createdAt: p.createdAt.toISOString(),
      }));

    const recentPosts = allPosts.slice(0, 10).map((p) => ({
      id: p.id,
      title: p.title,
      content: p.content,
      category: p.category,
      likeCount: p.likeCount,
      commentCount: p.commentCount,
      createdAt: p.createdAt.toISOString(),
    }));

    res.json({
      totalPosts,
      postsByCategory,
      mostLikedPosts,
      recentPosts,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get admin stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
