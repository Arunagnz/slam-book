function applyComposition(db) {
  const { user, post, comment } = db.models;

  user.hasMany(post);
  post.belongsTo(user, {
    foreignKey: "userId",
  });
  post.hasMany(comment);
  comment.belongsTo(post, {
    foreignKey: "postId",
    foreignKey: "userId",
  })
}

module.exports = { applyComposition };
