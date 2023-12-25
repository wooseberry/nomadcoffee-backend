import { createWriteStream , createReadStream} from "fs";
import bcrypt from "bcrypt";
import client from "../../client";
import { protectedResolver } from "../users.utils.js";
import { GraphQLUpload } from "graphql-upload-minimal"; // 수정된 부분

import {S3} from"aws-sdk";






export const resolverFn = async(
  _,
  { firstName, lastName, username, email, password: newPassword, bio ,avatar},
  { loggedInUser }
) =>{
  console.log("editProfile : resolverFn실행")
  console.log(`${loggedInUser} editporifle에 token이 입력되었습니다.`);

  // avatar
  let avatarUrl = null;
  if(avatar){
    const { filename, createReadStream } = await avatar;
    console.log("ddd");
    const newFilename = `${loggedInUser.id}-${Date.now()}-${filename}`;
    console.log(newFilename);

    const readStream = createReadStream();
    const writeStream = createWriteStream(process.cwd() + "/uploads/" + newFilename);
    readStream.pipe(writeStream);
    avatarUrl = `http://localhost:4000/static/${newFilename}`;
  }

  // password
  let uglyPassword = null;
  if (newPassword) {
    uglyPassword = await bcrypt.hash(newPassword, 10);
  }
  const updatedUser = await client.user.update({
    where: {
      id: loggedInUser.id,
    },
    data: {
      firstName,
      lastName,
      username,
      email,
      bio,
      ...(uglyPassword && { password: uglyPassword }),
      ...(avatarUrl && { avatar: avatarUrl }),

    },
  });
  if (updatedUser.id) {
    return {
      ok: true,
    };
  } else {
    return {
      ok: false,
      error: "Could not update profile.",
    };
  }

};


export default {
  Upload: GraphQLUpload,

  Mutation: {
    editProfile: protectedResolver(resolverFn),
  },
};