import { renderMarkerMap } from '../components/Map.js';
import StoryModel from '../models/StoryModel.js';
import Header from '../components/Header.js';
import StoryList from '../components/StoryList.js';


class StoryListView {
  constructor(container, token, logoutCallback) {
    this.container = container;
    this.token = token;
    this.logoutCallback = logoutCallback;
  }

  async render(stories) {
    try {
      this.stories = stories; // Gunakan data yang sudah di-fetch oleh presenter
  
      this.clearMainContent();
  
      const main = document.createElement('main');
      main.id = 'main-content';
  
      const storyListSection = StoryList(this.stories);
      main.appendChild(storyListSection);
  
      this.container.appendChild(main);
  
      this.stories.forEach((story) => {
        const mapContainer = document.querySelector(`[data-lat="${story.lat}"][data-lon="${story.lon}"]`);
        if (mapContainer) {
          renderMarkerMap(mapContainer, story.lat, story.lon);
        }
      });
    } catch (error) {
      console.error('Failed to render stories:', error);
      this.container.innerHTML = '<p>Gagal memuat daftar cerita.</p>';
    }
  }
  
  
  clearMainContent() {
    this.container.innerHTML = '';
  }  
}


export default StoryListView;  // Default export
