const { nanoid } = require("nanoid");

const {
  models: { post: Post },
} = require("../../sequelize");
const { constructResponse } = require("../../utils/responseUtil");
const userAuth = require("../../auth/userAuth");

module.exports = {
  Query: {
    async getAllPost() {
      try {
        const data = await Post.findAll();
        if (data)
          return {
            ...constructResponse(200, true, "Posts retrieved successfully"),
            data,
          };
        else
          return {
            ...constructResponse(404, false, "No post found"),
          };
      } catch (err) {
        throw new Error(err);
      }
    },
    async getPost(_, { postId }) {
      try {
        const data = await Post.findByPk(postId);
        if (data)
          return {
            ...constructResponse(200, true, "Post retrieved successfully"),
            data,
          };
        else
          return {
            ...constructResponse(404, false, "Post not found"),
          };
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async createPost(_, { postBody }, context) {
      try {
        const { id: userId } = userAuth(context);
        const newPost = {
          id: nanoid(),
          body: postBody,
          userId,
        };
        const data = await Post.create(newPost);
        return {
          ...constructResponse(200, true, "Post created successfully"),
          data,
        };
      } catch (err) {
        if (err.message == "invalid token")
          throw new Error("Invalid / Expired token");
        throw new Error(err);
      }
    },
    async updatePost(_, { postId, postBody }, context) {
      try {
        const { id: userId } = userAuth(context);
        let data = await Post.findByPk(postId);
        if (!data)
          return {
            ...constructResponse(404, false, "Post not found"),
          };
        if (userId !== data.userId)
          return {
            ...constructResponse(401, false, "Action not allowed"),
          };
        await Post.update(
          { body: postBody },
          {
            where: {
              id: postId,
            },
          }
        );
        data = await Post.findByPk(postId);
        return {
          ...constructResponse(200, true, "Post updated successfully"),
          data,
        };
      } catch (err) {
        console.log(err);
        if (err.message == "invalid token")
          throw new Error("Invalid / Expired token");
        throw new Error(err);
      }
    },
    async deletePost(_, { postId }, context) {
      try {
        const { id: userId } = userAuth(context);
        const data = await Post.findByPk(postId);
        if (!data)
          return {
            ...constructResponse(404, false, "Post not found"),
          };
        if (userId !== data.userId)
          return {
            ...constructResponse(401, false, "Action not allowed"),
          };
        await Post.destroy({
          where: {
            id: postId,
          },
        });
        return {
          ...constructResponse(200, true, "Post deleted successfully"),
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
