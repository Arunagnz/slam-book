const { nanoid } = require("nanoid");

const {
  models: { post: Post, comment: Comment },
} = require("../../sequelize");
const { constructResponse } = require("../../utils/responseUtil");
const userAuth = require("../../auth/userAuth");

module.exports = {
  Query: {
    async getComment(_, { commentId }) {
      try {
        const data = await Comment.findByPk(commentId);
        if (data)
          return {
            ...constructResponse(200, true, "Comment retrieved successfully"),
            data,
          };
        else
          return {
            ...constructResponse(404, false, "No comment found"),
          };
      } catch (err) {
        throw new Error(err);
      }
    },
    async getAllComment(_, { postId }) {
      try {
        let data = await Post.findByPk(postId, { include: ["comments"] });
        data = data.comments;
        if (data)
          return {
            ...constructResponse(200, true, "Comments retrieved successfully"),
            data,
          };
        else
          return {
            ...constructResponse(404, false, "No comment found"),
          };
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async createComment(_, { postId, commentBody }, context) {
      try {
        const { id: userId } = userAuth(context);
        const newComment = {
          id: nanoid(),
          body: commentBody,
          postId,
          userId,
        };
        const data = await Comment.create(newComment);
        return {
          ...constructResponse(200, true, "Comment created successfully"),
          data,
        };
      } catch (err) {
        if (err.message == "invalid token")
          throw new Error("Invalid / Expired token");
        throw new Error(err);
      }
    },
    async updateComment(_, { commentId, commentBody }, context) {
      try {
        const { id: userId } = userAuth(context);
        let data = await Comment.findByPk(commentId);
        if (!data)
          return {
            ...constructResponse(404, false, "Comment not found"),
          };
        if (userId !== data.userId)
          return {
            ...constructResponse(401, false, "Action not allowed"),
          };
        await Comment.update(
          { body: commentBody },
          {
            where: {
              id: commentId,
            },
          }
        );
        data = await Comment.findByPk(commentId);
        return {
          ...constructResponse(200, true, "Comment updated successfully"),
          data,
        };
      } catch (err) {
        console.log(err);
        if (err.message == "invalid token")
          throw new Error("Invalid / Expired token");
        throw new Error(err);
      }
    },
    async deleteComment(_, { commentId }, context) {
      try {
        const { id: userId } = userAuth(context);
        const data = await Comment.findByPk(commentId);
        if (!data)
          return {
            ...constructResponse(404, false, "Comment not found"),
          };
        if (userId !== data.userId)
          return {
            ...constructResponse(401, false, "Action not allowed"),
          };
        await Comment.destroy({
          where: {
            id: commentId,
          },
        });
        return {
          ...constructResponse(200, true, "Comment deleted successfully"),
          data,
        };
      } catch (err) {
        if (err.message == "invalid token")
          throw new Error("Invalid / Expired token");
        throw new Error(err);
      }
    },
  },
};
