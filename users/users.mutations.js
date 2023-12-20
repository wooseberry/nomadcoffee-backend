import bcrypt from "bcrypt";
import client from "../client";

export default {
  Mutation: {
    createAccount: async (_, { name, username, email, password }) => {
      try {
        const existingUser = await client.user.findFirst({
          where: {
            OR: [
              { username },
              { email },
            ],
          },
        });

        if (existingUser) {
          return {
            ok: false,
            error: "Username or email already exists",
            user: null,
          };
        }

        const uglyPassword = await bcrypt.hash(password, 10);

        const newUser = await client.user.create({
          data: {
            username,
            email,
            name,
            password: uglyPassword,
          },
        });

        return {
          ok: true,
          user: newUser,
          error: null,
        };
      } catch (error) {
        return {
          ok: false,
          error: error.message || "error!",
          user: null,
        };
      }
    },
  },
};
