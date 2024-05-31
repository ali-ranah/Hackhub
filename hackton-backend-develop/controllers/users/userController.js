const userModel = require('../../models/userModel');
const requestHandler = require('../../utils/requestHandler');
const cloudinary = require('../../middlewares/cloudinaryHandler');

async function handleGetUserList(req, res) {
  try {
    const users = await userModel.getUsers();
    return requestHandler.success(res, 200, 'Users fetched successfully', {
      users
    });
  } catch (error) {
    return requestHandler.error(res, 500, `server error ${error.message}`);
  }
}
async function handleGetSingleUser(req, res) {
  const { id } = req.params;
  const { email, username } = req.body;
  let searchQuery;
  if (id) {
    searchQuery = { id };
  }
  if (email) {
    searchQuery = { email };
  }
  if (username) {
    searchQuery = { username };
  }
  try {
    const user = await userModel.getSingleUser(searchQuery);
    if (user) {
      return requestHandler.success(res, 200, 'User fetched successfully', {
        user
      });
    }
    return requestHandler.error(
      res,
      400,
      `User with ${searchQuery} does not exist`
    );
  } catch (error) {
    return requestHandler.error(res, 500, `server error ${error.message}`);
  }
}

// const updateUserProfile = async (req, res) => {
//   try {
//     const { userId } = req.decodedToken;
//     const foundUser = await userModel.getSingleUser({ id: userId });
//     const {formData} = req.body;

//     if (foundUser) {
//       let updates = {};

//       // Allow participants to update additional fields
//       if (foundUser.role === 'Participant') {
//         if (formData.C_skill !== undefined) {
//           updates.C_skill = formData.C_skill;
//         }
//         if (formData.Cpp_skill !== undefined) {
//           updates.Cpp_skill = formData.Cpp_skill;
//         }
//         if (formData.JAVA_skill !== undefined) {
//           updates.JAVA_skill = formData.JAVA_skill;
//         }
//         if (formData.PYTHON_skill !== undefined) {
//           updates.PYTHON_skill = formData.PYTHON_skill;
//         }
//       }

//       if (formData.image_url) {
//         updates.image_url = formData.image_url;
//       }

//       // Allow both organizers and participants to update common fields
//       if (req.file) {
//         const currentImage = JSON.parse(foundUser.image_url);
//         formData.image_url = [
//           { avatar: req.file.secure_url, public_id: req.file.public_id }
//         ];
//         cloudinary.deleteCloudImage(currentImage);
//         updates.image_url = formData.image_url;
//       }

//       // Do not allow email updates
//       if (formData.email && formData.email !== foundUser.email) {
//         return requestHandler.error(res, 400, 'Email cannot be updated');
//       }

//       if (formData.username && formData.username !== foundUser.username) {
//         updates.username = formData.username;
//       }

//       if (formData.fullname && formData.fullname !== foundUser.fullname) {
//         updates.fullname = formData.fullname;
//       }

//       if (formData.country && formData.country !== foundUser.country) {
//         updates.country = formData.country;
//       }
//       if (formData.mobile && formData.mobile !== foundUser.mobile) {
//         updates.mobile = formData.mobile;
//       }
//       if (formData.region && formData.region !== foundUser.region) {
//         updates.region = formData.region;
//       }
//       if (formData.DOB && formData.DOB !== foundUser.DOB) {
//         updates.DOB = formData.DOB;
//       }

//       const userUpdates = await userModel.updateUser(updates, userId);
//       return requestHandler.success(res, 200, 'Profile updated successfully', {
//         userUpdates
//       });
//     }

//     return requestHandler.error(res, 400, `You are not authorized to do this`);
//   } catch (error) {
//     return requestHandler.error(res, 500, `Server error: ${error.message}`);
//   }
// };


const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.decodedToken;
    const foundUser = await userModel.getSingleUser({ id: userId });
    const formData = req.body; // Directly access req.body

    if (foundUser) {
      let updates = {};

      // Allow participants to update additional fields
      if (foundUser.role === 'Participant') {
        if (formData.C_skill !== 0) {
          updates.C_skill = formData.C_skill;
        }
        if (formData.Cpp_skill !== 0) {
          updates.Cpp_skill = formData.Cpp_skill;
        }
        if (formData.JAVA_skill !== 0) {
          updates.JAVA_skill = formData.JAVA_skill;
        }
        if (formData.PYTHON_skill !== 0) {
          updates.PYTHON_skill = formData.PYTHON_skill;
        }
      }

      if (req.file) {
        const currentImage = JSON.parse(foundUser.image_url);
        updates.image_url = [
          { avatar: req.file.secure_url, public_id: req.file.public_id }
        ];
        cloudinary.deleteCloudImage(currentImage);
      } else if (formData.image_url) {
        updates.image_url = formData.image_url;
      }

      // Do not allow email updates
      if (formData.email && formData.email !== foundUser.email) {
        return requestHandler.error(res, 400, 'Email cannot be updated');
      }

      if (formData.username && formData.username !== foundUser.username) {
        updates.username = formData.username;
      }

      if (formData.fullname && formData.fullname !== foundUser.fullname) {
        updates.fullname = formData.fullname;
      }

      if (formData.country && formData.country !== foundUser.country) {
        updates.country = formData.country;
      }
      if (formData.mobile && formData.mobile !== foundUser.mobile) {
        updates.mobile = formData.mobile;
      }
      if (formData.region && formData.region !== foundUser.region) {
        updates.region = formData.region;
      }
      if (formData.dob && formData.dob !== foundUser.DOB) {
        updates.DOB = formData.dob;
      }

      const userUpdates = await userModel.updateUser(updates, userId);
      return requestHandler.success(res, 200, 'Profile updated successfully', {
        userUpdates
      });
    }

    return requestHandler.error(res, 400, `You are not authorized to do this`);
  } catch (error) {
    return requestHandler.error(res, 500, `Server error: ${error.message}`);
  }
};




module.exports = {
  handleGetUserList,
  handleGetSingleUser,
  updateUserProfile
};
