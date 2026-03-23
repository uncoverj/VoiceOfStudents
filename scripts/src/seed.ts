import { db, postsTable, commentsTable } from "@workspace/db";

const CATEGORIES = ["Study", "Infrastructure", "Teachers", "Ideas", "Student Life"];

const posts = [
  {
    title: "The library needs longer opening hours",
    content: "During exam season, the library closes at 10pm, but many of us need to study until midnight. I think extending the hours during finals week would really help students manage their workload better. Other universities have 24-hour library access during exam periods.",
    category: "Infrastructure",
    likeCount: 47,
    commentCount: 3,
  },
  {
    title: "Professor feedback forms should be anonymous",
    content: "Currently, professors can often figure out who submitted which feedback based on the class size. I suggest implementing a system where feedback is fully anonymized with a minimum submission threshold before results are shown.",
    category: "Teachers",
    likeCount: 38,
    commentCount: 5,
  },
  {
    title: "Online course resources are disorganized",
    content: "It's really hard to find lecture slides and assignments on the portal. Different professors use completely different structures, making it confusing to navigate. A unified template would save everyone time.",
    category: "Study",
    likeCount: 29,
    commentCount: 2,
  },
  {
    title: "Student club room is too small",
    content: "The designated club room can barely fit 15 people. When we have events or meetings, we have to use hallways. We need a bigger dedicated space for student activities.",
    category: "Student Life",
    likeCount: 22,
    commentCount: 4,
  },
  {
    title: "Idea: student mentorship program",
    content: "What if we created a peer mentorship program where senior students guide freshmen? It would help new students adapt faster and seniors could earn credits or recognition. Many top universities have such programs.",
    category: "Ideas",
    likeCount: 55,
    commentCount: 8,
  },
  {
    title: "Wi-Fi in classrooms keeps dropping",
    content: "The internet connection in building B is extremely unreliable. During online presentations, the connection drops every few minutes. This is really embarrassing when presenting to professors.",
    category: "Infrastructure",
    likeCount: 41,
    commentCount: 6,
  },
  {
    title: "More group study spaces needed",
    content: "There are only 3 group study rooms in the whole campus. We often can't book them even a day in advance. Adding more collaborative spaces would greatly improve student productivity.",
    category: "Study",
    likeCount: 33,
    commentCount: 2,
  },
  {
    title: "Student wellbeing support should be more visible",
    content: "I didn't even know we had a counseling service until my third year. The university should do a better job communicating mental health resources to students. Regular workshops and visible signage would help.",
    category: "Student Life",
    likeCount: 61,
    commentCount: 9,
  },
  {
    title: "Professors should provide more feedback on assignments",
    content: "Many times we get grades back with just a number and no explanation of what we did wrong. Constructive feedback helps us improve. Even a few bullet points would make a huge difference.",
    category: "Teachers",
    likeCount: 44,
    commentCount: 7,
  },
  {
    title: "Idea: hackathon for CS students",
    content: "We should organize an annual hackathon where students can show their skills and solve real university problems. This would also help students build portfolios and connect with potential employers in Tashkent.",
    category: "Ideas",
    likeCount: 52,
    commentCount: 11,
  },
];

const comments: { postIndex: number; content: string }[] = [
  { postIndex: 0, content: "Completely agree! I had to go home early multiple times because of the closing time." },
  { postIndex: 0, content: "Even just staying open until midnight on weekdays would be a huge improvement." },
  { postIndex: 0, content: "Some of us live far from campus, so late-night access is essential." },
  { postIndex: 1, content: "This is such an important issue. I have been scared to give honest feedback." },
  { postIndex: 1, content: "Minimum threshold idea is smart. Protects anonymity while still collecting data." },
  { postIndex: 4, content: "I would definitely participate in this as a mentor!" },
  { postIndex: 4, content: "Great idea - could also connect us with alumni network." },
  { postIndex: 7, content: "Thank you for raising this. Mental health matters." },
  { postIndex: 7, content: "The counseling office helped me so much, more students should know about it." },
  { postIndex: 9, content: "I would join a hackathon team for sure!" },
  { postIndex: 9, content: "We could even invite local tech companies as sponsors." },
];

async function seed() {
  console.log("Seeding database...");

  await db.delete(commentsTable);
  await db.delete(postsTable);

  const insertedPosts = await db.insert(postsTable).values(
    posts.map((p) => ({
      title: p.title,
      content: p.content,
      category: p.category,
      likeCount: p.likeCount,
      commentCount: p.commentCount,
    }))
  ).returning();

  for (const comment of comments) {
    const post = insertedPosts[comment.postIndex];
    if (post) {
      await db.insert(commentsTable).values({
        postId: post.id,
        content: comment.content,
      });
    }
  }

  console.log(`Seeded ${insertedPosts.length} posts and ${comments.length} comments.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
