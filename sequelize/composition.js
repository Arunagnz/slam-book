function applyComposition(db) {
  const { user, post } = db.models;

  user.hasMany(post);
  post.belongsTo(user);
}

module.exports = { applyComposition };
