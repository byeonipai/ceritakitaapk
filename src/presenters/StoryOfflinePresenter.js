import { getStories, deleteStory } from '../utils/indexedDB';
import StoryOfflineView from '../views/StoryOfflineView';

export default class StoryOfflinePresenter {
    constructor(container) {
        this.view = new StoryOfflineView(container);
        this.view.bindDeleteOffline(this.handleDeleteOffline.bind(this));
    }

    async init() {
        const stories = await getStories();
        this.view.render(stories);
    }

    async handleDeleteOffline(id) {
        await deleteStory(id);
        const stories = await getStories();
        this.view.render(stories);
    }
}
