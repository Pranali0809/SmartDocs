const ProfileService = require('../../services/ProfileService');

const ProfileResolver = {
  Query: {
    getUserProfile: async (_, { userId }) => {
      try {
        const profile = await ProfileService.getOrCreateProfile(userId);
        return profile;
      } catch (error) {
        console.error('Get profile error:', error);
        throw new Error('Failed to get user profile');
      }
    }
  },

  Mutation: {
    updateUserProfile: async (_, { userId, displayName, cursorColor }) => {
      try {
        const updates = {};
        if (displayName !== undefined) updates.displayName = displayName;
        if (cursorColor !== undefined) updates.cursorColor = cursorColor;

        const profile = await ProfileService.updateProfile(userId, updates);
        return profile;
      } catch (error) {
        console.error('Update profile error:', error);
        throw new Error('Failed to update profile');
      }
    },

    uploadProfilePhoto: async (_, { userId, base64Image }) => {
      try {
        const profile = await ProfileService.uploadProfilePhoto(userId, base64Image);
        return profile;
      } catch (error) {
        console.error('Upload photo error:', error);
        throw new Error('Failed to upload profile photo');
      }
    },

    deleteProfilePhoto: async (_, { userId }) => {
      try {
        const profile = await ProfileService.deleteProfilePhoto(userId);
        return profile;
      } catch (error) {
        console.error('Delete photo error:', error);
        throw new Error('Failed to delete profile photo');
      }
    }
  }
};

module.exports = ProfileResolver;
