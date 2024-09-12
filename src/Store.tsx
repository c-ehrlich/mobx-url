import { makeAutoObservable, observable, action, runInAction } from "mobx";

class QueryParamsStore {
  params: Map<string, string>;

  constructor() {
    makeAutoObservable(this, {
      params: observable,
      setParam: action,
      updateFromUrl: action,
    });
    this.params = observable.map<string, string>();
    this.updateFromUrl();

    window.addEventListener("popstate", () => {
      this.updateFromUrl();
    });
  }

  // Synchronize the store with the current URL
  updateFromUrl() {
    const searchParams = new URLSearchParams(window.location.search);
    runInAction(() => {
      this.params.clear();
      for (const [key, value] of searchParams.entries()) {
        this.params.set(key, value);
      }
    });
  }

  // Set a query parameter and update the URL
  setParam(key: string, value: string) {
    this.params.set(key, value);
    this.updateUrl();
  }

  // Update the browser's URL based on the store's state
  updateUrl() {
    const searchParams = new URLSearchParams();
    for (const [key, value] of this.params.entries()) {
      searchParams.set(key, value);
    }
    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.pushState({}, "", newUrl);
  }

  // Get a specific query parameter
  getParam(key: string): string | undefined {
    return this.params.get(key);
  }
}

export const queryParamsStore = new QueryParamsStore();
