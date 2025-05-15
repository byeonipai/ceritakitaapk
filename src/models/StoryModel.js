import { getStories, postStory } from '../utils/api.js';
 
const StoryModel = {
  async fetchStories(token = null) {
    try {
      const response = await getStories(token); // tetap kirim token, walau null
      return response.listStory.map((story) => ({
        id: story.id,
        name: story.name,
        description: story.description,
        photoUrl: story.photoUrl,
        createdAt: story.createdAt,
        lat: story.lat,
        lon: story.lon,
      }));
    } catch (error) {
      console.error('Gagal mengambil cerita:', error);
      return [];
    }
  },
 
  async addStory(data, token) {
    try {
      const result = await postStory(data, token);
      return result;
    } catch (error) {
      console.error('Gagal menambahkan cerita:', error);
      throw error;
    }
  }
};
 
export default StoryModel;