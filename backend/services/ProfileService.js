const UserProfile = require('../models/UserProfile');
const admin = require('../connections/firebaseconfig');

class ProfileService {
  async getOrCreateProfile(userId) {
    try {
      let profile = await UserProfile.findOne({ userId });

      if (!profile) {
        profile = new UserProfile({
          userId,
          displayName: 'User',
          cursorColor: this.generateRandomColor(),
          profilePhotoUrl: '',
          profilePhotoFirebasePath: ''
        });
        await profile.save();
        console.log('✅ Created new user profile for:', userId);
      }

      return profile;
    } catch (error) {
      console.error('❌ Error getting/creating profile:', error);
      throw error;
    }
  }

  async updateProfile(userId, updates) {
    try {
      const profile = await UserProfile.findOneAndUpdate(
        { userId },
        { ...updates, updatedAt: Date.now() },
        { new: true, upsert: true }
      );

      console.log('✅ Profile updated for user:', userId);
      return profile;
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      throw error;
    }
  }

  async uploadProfilePhoto(userId, base64Image) {
    try {
      const bucket = admin.storage().bucket();
      const fileName = `profile-photos/${userId}-${Date.now()}.jpg`;

      const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      const file = bucket.file(fileName);

      await file.save(buffer, {
        metadata: {
          contentType: 'image/jpeg',
          metadata: {
            firebaseStorageDownloadTokens: require('uuid').v4()
          }
        },
        public: true
      });

      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

      const profile = await this.updateProfile(userId, {
        profilePhotoUrl: publicUrl,
        profilePhotoFirebasePath: fileName
      });

      console.log('✅ Profile photo uploaded:', publicUrl);
      return profile;
    } catch (error) {
      console.error('❌ Error uploading profile photo:', error);
      throw error;
    }
  }

  async deleteProfilePhoto(userId) {
    try {
      const profile = await UserProfile.findOne({ userId });

      if (profile && profile.profilePhotoFirebasePath) {
        const bucket = admin.storage().bucket();
        const file = bucket.file(profile.profilePhotoFirebasePath);

        try {
          await file.delete();
          console.log('✅ Deleted profile photo from Firebase');
        } catch (error) {
          console.warn('⚠️ Could not delete photo from Firebase:', error.message);
        }

        profile.profilePhotoUrl = '';
        profile.profilePhotoFirebasePath = '';
        await profile.save();
      }

      return profile;
    } catch (error) {
      console.error('❌ Error deleting profile photo:', error);
      throw error;
    }
  }

  generateRandomColor() {
    const colors = [
      '#4285f4', '#ea4335', '#34a853', '#fbbc04',
      '#9c27b0', '#ff6d00', '#00bcd4', '#e91e63'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}

module.exports = new ProfileService();
